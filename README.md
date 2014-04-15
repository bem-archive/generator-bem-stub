# generator-bem-stub

A generator on [Yeoman](http://yeoman.io) of bem-project-stub.

## Install

```
$ npm install generator-bem-stub
```

## Usage

Run:

```
$ yo bem-stub
```

or use ```JSON-file``` with answers as the parameter:

```
$ yo bem-stub FULL_PATH_TO_JSON-FILE
```

For example, we have the file with answers ```example.json``` which lies in the directory where we want to create the project:

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

Run:

```
$ yo bem-stub example.json
```

```generator-bem-stub``` will take the content of ```example.json``` as answers.

I will give more examples of ```JSON-files``` later.

## Installation of dependencies

```generator-bem-stub``` will install all the dependences from ```package.json``` automatically.

If you want to do it manually:

```
$ yo bem-stub --no-deps

$ yo bem-stub FULL_PATH_TO_JSON-FILE --no-deps
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
