#!/bin/bash

region=$1

echo "Seed Tables"
node ./script/seed_tables.js "$region"
