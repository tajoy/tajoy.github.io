#!/bin/bash
rsync -v -e "ssh -o StrictHostKeyChecking=no" -r --delete-after --quiet \
    $TRAVIS_BUILD_DIR/public/ \
    $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH