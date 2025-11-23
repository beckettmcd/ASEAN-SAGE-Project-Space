#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --lts 2>/dev/null || nvm install --lts
cd "/Users/beckettmcdowell/ASEAN SAGE Project Space"
npm run dev


