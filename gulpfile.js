const gulp = require('gulp');
// const gulpif = require('gulp-if');
// const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const fs = require('fs');
// const path = require('path');

// CSS: минификация + Autoprefixer (кроссбраузерность)
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// JS: Babel (ES6+ → ES5) + Terser (лучше Uglify для modern JS)
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');


// Парсинг CLI аргументов
const argv = yargs(hideBin(process.argv))
    .scriptName('gulp')
    .usage('$0 <cmd> [args]')
    .command('js', 'Обработать JS файлы')
    .command('css', 'Обработать CSS файлы')
    .command('minify', 'Обработать все файлы')
    .option('files', {
        alias: 'f',
        type: 'array',
        desc: 'Файлы для обработки (app.js style.css)'
    })
    .option('config', {
        alias: 'c',
        type: 'string',
        default: 'default',
        desc: 'Конфиг: default|main|test (из gulp-config.json)'
    })
    .option('mode', {
        alias: 'm',
        type: 'string',
        default: 'normal',
        choices: ['light', 'normal', 'hard'],
        desc: 'Режим минификации'
    })
    .option('type', {
        alias: 't',
        type: 'string',
        choices: ['js', 'css'],
        desc: 'Тип файлов (js/css)'
    })
    .help('h')
    .alias('help', 'h')
    .argv;

// Загрузка конфига
const config = JSON.parse(fs.readFileSync('./gulp-config.json', 'utf8'));
const modeConfig = config.minifyModes[argv.mode] || config.minifyModes.normal;

// Название папки с темой
var nameTheme = null;

process.argv.forEach((val) => {
    // Проверка параметра с активным магазином в консоли
    if (~val.indexOf('theme=')) {
        var shopFolder = val.split('=')[1];
        var stat = fs.statSync(shopFolder);
        if (stat.isDirectory()) nameTheme = shopFolder;
    }
});

if (!nameTheme && config.files.path) {
    nameTheme = config.files.path;
}

if (!nameTheme) {
  console.error('\n❌ ОШИБКА: Обязательный параметр theme не указан!');
  console.error('Пример: npx gulp minify theme=theme_1');
  
  process.exitCode = 1;  // Код ошибки для терминала
  process.exit(1);       // Принудительное завершение
}

console.log(`Папка с темой: ${nameTheme}`);

function getFilePaths(type) {
    const typeSelect = type === "js" ? "js" : "style";
    if (argv.files?.length) {
        return argv.files.map(f => `${nameTheme}/assets/${typeSelect}/${f}`);
    } else if (argv.config !== 'default') {
        return config.files[type][argv.config].map(f => `${nameTheme}/assets/${typeSelect}/${f}`);
    }
    return [
        `${nameTheme}/assets/${type}/**/*.${typeSelect}`,
        `!${nameTheme}/assets/${type}/**/*.min.*`
    ];
}


// Минификация JS
function minifyJS() {
    const paths = getFilePaths('js');
    return gulp.src(paths, { allowEmpty: true })
		// .pipe(sourcemaps.init({ loadMaps: true }))  // Только если нужно
        .pipe(sourcemaps.init())
		.pipe(babel({
            // compact: true,
			presets: ['@babel/preset-env']
		}))
		.pipe(terser(modeConfig.terser))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(`${nameTheme}/assets/js`))
		.on('end', () => console.log(`✅ JS готов (${argv.mode} mode)`));
}

// Минификация CSS
function minifyCSS() {
    const paths = getFilePaths('css');
    return gulp.src(paths, { allowEmpty: true })
		// .pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.init())
		.pipe(postcss([
			autoprefixer({
				overrideBrowserslist: ['> 1%', 'last 2 versions', 'ie >= 11']
			})
		]))
		.pipe(cleanCSS({ level: modeConfig.cleanCSS }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(`${nameTheme}/assets/style`))
		.on('end', () => console.log(`✅ CSS готов (${argv.mode} mode)`));
}

// Общая задача
const minify = gulp.series(
    argv.type ? (argv.type === 'js' ? minifyJS : minifyCSS) : gulp.parallel(minifyJS, minifyCSS),
    (done) => {
        console.log('✅ Оптимизация прошла успешно!');
        done();
    }
);

exports.default = minify; // По-умолчанию minify
exports.minify = minify;  // Основная команда
exports.js = minifyJS;    // Только JS (опционально)
exports.css = minifyCSS;  // Только CSS (опционально)


// Показать справку для конкретной задачи
gulp.task('help', (cb) => {
  console.log(`
🛠  GULP MINI-FIKATOR v1.0

Использование:
  npx gulp <task> [опции]

📋 Задачи:
  js      - Только JS файлы
  css     - Только CSS файлы  
  minify  - Все файлы (по умолчанию)
  help    - Эта справка

⚙️  Опции:
  --files, -f app.js style.css     Файлы для обработки
  --config, -c main                Конфиг из gulp-config.json
  --mode, -m light                 light/normal/hard (по умолчанию: normal)
  --type, -t js                    js/css
  --help, -h                       Справка

💡 Примеры:
  npx gulp js --files em_theme.js           # Конкретный JS
  npx gulp css --config main --mode hard    # CSS из конфига жёстко
  npx gulp minify --mode light              # Всё легко
  npx gulp --type js --config vendor        # Vendor JS

📁 Конфиг: ./gulp-config.json
  `);
  cb();
});