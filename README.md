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

or use ```JSON-file``` with answers as a parameter:

```
$ yo bemgen FULL_PATH_TO_JSON-FILE
```

For example, we have a file with the answers ```example.json``` which lies in the directory where we want to create the project:

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
$ yo bemgen example.json
```

```bemgen``` will take the content of the ```example.json``` as answers.

Go to the ```test/basic``` and see more examples of ```JSON-files```.

## Assembly

As soon as you answer all questions you will have to assembly the created project:

```
$ cd THE_NAME_OF_YOUR_PROJECT

$ npm i

$ ./node_modules/.bin/bem make
```

Do you find these operations really tedious and boring? Open an issue and I will automatize this process.
I have not aleady done this, because it is more convenient to test the work of the ```generator-bemgen``` and assembly of created projects seperately.

## Tests

Run from the root folder of ```generator-bemgen```:

```
$ cd test
```

Then run:

```
$ ./run.sh
```

or

```$ ./run.sh -b``` - to check the created files and the assembly of the projects (higher quality testing, but slower)

```$ ./run.sh -b -n``` - to check only the created files of the projects (lower quality testing, but faster)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
