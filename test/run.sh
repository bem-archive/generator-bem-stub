START=$(date +%s)

echo 'Running tests...'

if ! [ -d output ]; then
    mkdir output
else
    rm -rf output/*
fi

k=0
make=true

if [ "$1" = "" ] || [ "$1" = '+a' ] || [ "$1" = '-basic' ]; then
    folder='basic'
    if [ "$1" != '+a' ] && [ "$2" != '+a' ]; then
        make=false
    fi
elif [ "$1" = '-more' ]; then
    folder='more'
else
    echo '==> FAIL -> Invalid parameter'
    exit 1
fi

for j in $folder/* ;
do
    fLen=${#folder}

    cd output

    yo bemstub ../$j/answers.json

    projectName=${j:fLen+1}
    cd $projectName

    if [ $folder = 'basic' ]; then
        if ! diff ../../$j/package.json package.json; then
            echo '==> FAIL ->' $j/package.json '!==' output/$projectName/package.json
            exit 1
        elif ! diff ../../$j/make.js .bem/make.js; then
            echo '==> FAIL ->' $j/make.js '!==' output/$projectName/.bem/make.js
            exit 1
        elif ! diff ../../$j/level.js desktop.bundles/.bem/level.js; then
            echo '==> FAIL ->' $j/level.js '!==' output/$projectName/desktop.bundles/.bem/level.js
            exit 1
        elif ! diff ../../$j/blocks.js .bem/levels/blocks.js; then
            echo '==> FAIL ->' $j/blocks.js '!==' output/$projectName/.bem/levels/blocks.js
            exit 1
        elif ! diff ../../$j/index.bemjson.js desktop.bundles/index/index.bemjson.js; then
            echo '==> FAIL ->' $j/index.bemjson.js '!==' output/$projectName/desktop.bundles/index/index.bemjson.js
            exit 1
        fi
    fi

    k=$(( $k + 1 ))

    if [ $make = true ]; then
        npm install
        ./node_modules/.bin/bem make
    fi

    if [ "$?" -ne "0" ]
    then
        echo output/$projectName '==> FAIL -> ./node_modules/.bin/bem make'
        exit 1
    fi

    cd ../..
done

echo
echo '==> OK! -> '$k 'tests'

END=$(date +%s)
DIFF=$(( $END - $START ))
echo "It took $DIFF seconds"
