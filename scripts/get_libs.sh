#!/bin/bash

ROOT=$(pwd)
force=false
. ~/.nvm/nvm.sh

if [[ $1 == "force" ]] ; then
   force=true
fi

if [[ ! -d $ROOT/src ]]; then
    if [[ ! -d ../src ]]; then
        echo "folder '$ROOT/src'. Verifique que está ejecutando este script desde la raíz del proyecto. Ej:"
        echo "$ npm run vapaee-libs"
        exit 1;
    else
        cd ..
        ROOT=${pwd}
    fi
fi

cd $ROOT/..
VPE_LIBS=$(pwd)/vapaee-npm-libs

if [[ ! -d $ROOT/node_modules ]]; then
    echo "folder $ROOT/node_modules not found"
    exit 1;
fi

if [[ ! -d $VPE_LIBS ]]; then
    echo "folder $VPE_LIBS not found"
    exit 1;
fi

cd $VPE_LIBS



# ------ idp-core ---------
LIB_NAME=core
LIB_ROOT=$VPE_LIBS/projects/vapaee/$LIB_NAME
LIB_INDEX_FILE=$VPE_LIBS/dist/vapaee/$LIB_NAME/index.d.ts
LIB_LIB_FOLDER=$LIB_ROOT/src/lib/
if [[ $LIB_LIB_FOLDER/types-core.ts              -nt $LIB_INDEX_FILE ||
      $force == true ]]; then
    
    cd $VPE_LIBS
    ./scripts/compile.sh $LIB_NAME
    rm $ROOT/node_modules/@vapaee/$LIB_NAME -fr
    cp -r $VPE_LIBS/dist/vapaee/$LIB_NAME $ROOT/node_modules/@vapaee
fi


# ------ styles ---------
LIB_NAME=styles
LIB_ROOT=$VPE_LIBS/projects/vapaee/$LIB_NAME
LIB_INDEX_FILE=$VPE_LIBS/dist/vapaee/$LIB_NAME/index.d.ts
LIB_LIB_FOLDER=$LIB_ROOT/src/lib/
if [[ $LIB_LIB_FOLDER/styles.module.ts           -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/styles.service.ts          -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/types-styles.ts            -nt $LIB_INDEX_FILE ||
      $force == true ]]; then
    
    cd $VPE_LIBS
    ./scripts/compile.sh $LIB_NAME
    rm $ROOT/node_modules/@vapaee/$LIB_NAME -fr
    cp -r $VPE_LIBS/dist/vapaee/$LIB_NAME $ROOT/node_modules/@vapaee
fi

# ------ feedback ---------
LIB_NAME=feedback
LIB_ROOT=$VPE_LIBS/projects/vapaee/$LIB_NAME
LIB_INDEX_FILE=$VPE_LIBS/dist/vapaee/$LIB_NAME/index.d.ts
LIB_LIB_FOLDER=$LIB_ROOT/src/lib/
if [[ $LIB_LIB_FOLDER/feedback.class.ts             -nt $LIB_INDEX_FILE ||
      $force == true ]]; then

    cd $VPE_LIBS
    ./scripts/compile.sh $LIB_NAME
    rm $ROOT/node_modules/@vapaee/$LIB_NAME -fr
    cp -r $VPE_LIBS/dist/vapaee/$LIB_NAME $ROOT/node_modules/@vapaee
fi

# ------ wallet ---------
LIB_NAME=wallet
LIB_ROOT=$VPE_LIBS/projects/vapaee/$LIB_NAME
LIB_INDEX_FILE=$VPE_LIBS/dist/vapaee/$LIB_NAME/index.d.ts
LIB_LIB_FOLDER=$LIB_ROOT/src/lib/
if [[ $LIB_LIB_FOLDER/asset.class.ts            -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/contract.class.ts         -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/eos-connexion.class.ts    -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/token.class.ts            -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/types-wallet.ts           -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/utils.class.ts            -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/wallet.module.ts          -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/wallet.service.spec.ts    -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/wallet.service.ts         -nt $LIB_INDEX_FILE ||
      $force == true ]]; then
    
    cd $VPE_LIBS
    ./scripts/compile.sh $LIB_NAME
    rm $ROOT/node_modules/@vapaee/$LIB_NAME -fr
    cp -r $VPE_LIBS/dist/vapaee/$LIB_NAME $ROOT/node_modules/@vapaee
fi

# ------ rex ---------
LIB_NAME=rex
LIB_ROOT=$VPE_LIBS/projects/vapaee/$LIB_NAME
LIB_INDEX_FILE=$VPE_LIBS/dist/vapaee/$LIB_NAME/index.d.ts
LIB_LIB_FOLDER=$LIB_ROOT/src/lib/
if [[ $LIB_LIB_FOLDER/rex.module.ts              -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/rex.service.ts             -nt $LIB_INDEX_FILE ||
      $force == true ]]; then
    
    cd $VPE_LIBS
    ./scripts/compile.sh $LIB_NAME
    rm $ROOT/node_modules/@vapaee/$LIB_NAME -fr
    cp -r $VPE_LIBS/dist/vapaee/$LIB_NAME $ROOT/node_modules/@vapaee
fi

# ------ idp-anchor ---------
LIB_NAME=idp-anchor
LIB_ROOT=$VPE_LIBS/projects/vapaee/$LIB_NAME
LIB_INDEX_FILE=$VPE_LIBS/dist/vapaee/$LIB_NAME/index.d.ts
LIB_LIB_FOLDER=$LIB_ROOT/src/lib/
if [[ $LIB_LIB_FOLDER/anchor-id-provider.class.ts  -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/types-anchor.ts              -nt $LIB_INDEX_FILE ||
      $force == true ]]; then
    
    cd $VPE_LIBS
    npm run lib-idp-anchor
    
    #./scripts/compile.sh $LIB_NAME
    rm $ROOT/node_modules/@vapaee/$LIB_NAME -fr
    cp -r $VPE_LIBS/dist/vapaee/$LIB_NAME $ROOT/node_modules/@vapaee
fi


# ------ idp-local ---------
LIB_NAME=idp-local
LIB_ROOT=$VPE_LIBS/projects/vapaee/$LIB_NAME
LIB_INDEX_FILE=$VPE_LIBS/dist/vapaee/$LIB_NAME/index.d.ts
LIB_LIB_FOLDER=$LIB_ROOT/src/lib/
if [[ $LIB_LIB_FOLDER/idp-local.module.ts                  -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/local-eoskey.class.ts                -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/local-identity-manager.service.ts    -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/types-local.ts                       -nt $LIB_INDEX_FILE ||
      $force == true ]]; then
    
    cd $VPE_LIBS
    npm run lib-idp-local
    
    #./scripts/compile.sh $LIB_NAME
    rm $ROOT/node_modules/@vapaee/$LIB_NAME -fr
    cp -r $VPE_LIBS/dist/vapaee/$LIB_NAME $ROOT/node_modules/@vapaee
fi

# ------ dex ---------
LIB_NAME=dex
LIB_ROOT=$VPE_LIBS/projects/vapaee/$LIB_NAME
LIB_INDEX_FILE=$VPE_LIBS/dist/vapaee/$LIB_NAME/index.d.ts
LIB_LIB_FOLDER=$LIB_ROOT/src/lib/
if [[ $LIB_LIB_FOLDER/asset-dex.class.ts   -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/dex.module.ts        -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/dex.service.ts       -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/swap.service.ts      -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/token-dex.class.ts   -nt $LIB_INDEX_FILE ||
      $LIB_LIB_FOLDER/types-dex.ts         -nt $LIB_INDEX_FILE ||
      $force == true ]]; then
    
    cd $VPE_LIBS
    ./scripts/compile.sh $LIB_NAME
    rm $ROOT/node_modules/@vapaee/$LIB_NAME -fr
    cp -r $VPE_LIBS/dist/vapaee/$LIB_NAME $ROOT/node_modules/@vapaee
fi
