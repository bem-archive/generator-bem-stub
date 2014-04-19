# generator-bem-stub

Генератор BEM-проектов на [Yeoman](http://yeoman.io).

## Установка

```
$ npm install generator-bem-stub
```

## Использование

Выполните:

```
$ yo bem-stub
```

или используйте ```JSON-файл``` с ответами в качестве параметра:

```
$ yo bem-stub ПОЛНЫЙ_ПУТЬ_К_JSON-ФАЙЛУ
```

Например, у вас есть файл с ответами ```example.json```, который лежит в директории, где вы хотите создать проект:

```
{
  "projectName": "example",
  "author": "Ivan Ivanov",
  "email": "ivan@yandex.ru",
  "collector": "bem-tools",
  "baseLibrary": {
    "name": "bem-core",
    "version": "v2.1.0"
  },
  "addLibraries": [],
  "platforms": [
    "common",
    "desktop"
  ],
  "preprocessor": "roole",
  "techs": []
}
```

Выполните:

```
$ yo bem-stub example.json
```

```generator-bem-stub``` возьмет содержимое файла ```example.json``` в качестве ответов.

Я продемонстрирую больше примеров ```JSON-файлов``` позже.

## Установка зависимостей

```generator-bem-stub``` установит все зависимости из файла ```package.json``` автоматически.

Если вы хотите сделать это вручную:

```
$ yo bem-stub --no-deps

$ yo bem-stub ПОЛНЫЙ_ПУТЬ_К_JSON-ФАЙЛУ --no-deps
```

## Локализация

```generator-bem-stub``` поддерживает два языка - русский и английский.

Чтобы переключиться между языками:

```
$ yo bem-stub --language

```

## Лицензия

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
