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
$ yo bemgen FULL_PATH_TO_JSON-FILE
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

## Tests

```
cd test
```

Run:

```./run.sh -b```
or
```./run.sh``` - to check the created files and the assembly of the projects (higher quality testing, but slower)

```./run.sh -b -n``` - to check only the created files of the projects (lower quality testing, but faster)
