# generator-bemgen

A generator for [Yeoman](http://yeoman.io).

## Install

```
$ npm install -g yo

$ git clone https://github.com/eGavr/generator-bemgen.git

$ cd generator-bemgen

$ npm link
```

## Usage

Run from any directory you want:

```
$ yo bemgen
```

or use ```JSON-file``` with answers as parameter:

```
$ yo bemgen FULL PATH TO JSON-file
```

For example, we have a file with answers ```example.json``` which lies in the directory where we want to creat a project:

```
{
  "projectName": "example",
  "author": "Ivan Ivanov",
  "email": "example@yandex.ru",
  "collector": "bem",
  "baseLibrary": { "name": "bem-core", "version": "v1" },
  "addLibraries": [],
  "platforms": [ "common", "desktop" ],
  "localization": false,
  "techs": []
}
```

Run:

```
yo bemgen example.json
```

```bemgen``` will take the content of ```example.json``` as answers.

Go to ```test/basic``` and see more examples of JSON-files.