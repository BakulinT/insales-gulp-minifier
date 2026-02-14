# 🚀 Gulp-минификатор для тем InSales

> Сборка под разработку тем InSales

Минификация, оптимизация и кроссбраузерная сборка JS/CSS 
для InSales Uploader. ES6→ES5, Autoprefixer, Terser, 3 режима сжатия.

## ✨ Особенности
- ✅ Минификация JS (Babel + Terser) + CSS (PostCSS)
- ✅ Кроссбраузерность (IE11+, Safari 10+)
- ✅ CLI параметры: --files, --config, --mode, --theme
- ✅ Конфиг `gulp-config.json` для групп файлов
- ✅ Поддержка InSales Uploader (автозагрузка *.min.*)
- ✅ 3 режима: light/normal/hard

## 🚀 Быстрый старт

```bash
npm install
npx gulp minify theme=your-theme
npx gulp minify theme=your-theme --mode=hard
```

## 📚 Примеры использования

### 1. По файлам из CLI

```bash
# Только конкретные JS
npx gulp js --files em_theme.js app.js

# Только CSS
npx gulp css --files style.css theme.css
```

### 2. Из конфига gulp-config.json

```bash
# JS из "main" секции конфига
npx gulp js --config main

# CSS из "components"
npx gulp css --config components

# Тип + конфиг
npx gulp --type js --config vendor
```

### 3. Режимы минификации
```bash
# Легкая (без изменений имен)
npx gulp minify --mode light

# Максимальный (удаляет console.log)
npx gulp js --mode hard

# По умолчанию: normal
npx gulp css --mode normal
npx gulp css
```

### 4. Комбо

```bash
# Максимальный режим оптимизации для JS файла theme.js
npx gulp js --files theme.js --mode hard
```

### 5. Справка
```bash
npx gulp help
npx gulp --help
npx gulp --h
```

## 🗂️ Структура проекта

```text
insales-gulp-minifier/
├── theme_1/            # Пример рабочей темы 1
│   ├── index.js        # Настройками доступа к магазину
├── theme_2/            # Пример рабочей темы 2
│   ├── index.js        # Настройками доступа к магазину
├── gulpfile.js         # Основной Gulp
├── insales-config.js   # Конфигурация uploader
├── gulp-config.json    # Пример конфига для проекта
├── package.json        # Только нужные devDependencies

```
