const extend = require('deepmix');
const fs = require('fs');
// var imagemin = require('gulp-imagemin');
// var autoprefixer = import('insales-uploader-autoprefixer');
// var jsValidate = import('gulp-jsvalidate');

// Загрузка конфига
const config = JSON.parse(fs.readFileSync('./gulp-config.json', 'utf8'));

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
  console.error('💡 Пример: npx gulp minify theme=theme_1');
  
  process.exitCode = 1;  // Код ошибки для терминала
  process.exit(1);       // Принудительное завершение
}

console.log(`Папка с темой: ${nameTheme}`);

/**
 * Настройки поумолчанию
 */
var defaultConfig = {
    account: {
        http: false
    },
    theme: {
        root: './' + nameTheme,
        backup: false, // Создавать backup после загрузки?
        assetsSync: true, // Делать синхронизацию с директорией assets?
    },
    plugins: {
        // файлы которые не обрабатываются плагинами
        exclude: ['*.min.js', '*.min.css', '*.liquid'],

        /** 
        style: function (stream) {
            return stream
                .pipe(autoprefixer({
                    browsers: ['last 10 versions'],
                    cascade: true
                }))
        },
        // gulp плагины для скриптов
        script: function (stream) {
            return stream
                .pipe(uglify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(shop + "2/" + 'assets/js'));
        },
        // gulp плагины для изображений
        img: function (stream) {
            return stream
                .pipe(imagemin())
        }
        */
    },
    chokidarOptions: {
        ignored: /[\/\\]\./,
        ignoreInitial: true,
        followSymlinks: true,
        usePolling: false,
        interval: 200,
        delay: 0,
        binaryInterval: 300,
        alwaysStat: true,
        depth: 99,
        awaitWriteFinish: {
            stabilityThreshold: 100,
            pollInterval: 100
        },
        ignorePermissionErrors: true
    },
    util: {
        openBrowser: false // Открывать браузер при запуске стрима?
    }
}

module.exports = extend(defaultConfig, require('./' + nameTheme));