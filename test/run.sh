echo 'Running tests...'
rm -rf output/*

for j in input/* ;
do
    i=$j/${j:6}.json
    cd output

    yo bemgen ../$i

    len=${#i}
    projectName=${i:6:(len-12)/2}
    cd $projectName

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
    fi 

    npm install
    ./node_modules/.bin/bem make

    if [ "$?" -ne "0" ]
    then    
        echo output/$projectName '==> FAIL -> ./node_modules/.bin/bem make'
        exit 1
    fi

    cd ../..
done