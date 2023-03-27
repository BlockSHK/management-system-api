#!/bin/bash

nftenv=$1
region=$2

echo "Seed Tables"
node ../data/script/seed_tables.js "$nftenv"

echo "Seed Keys"
node ../data/script/seedKeys.js "$nftenv"

echo "Add Stripe Webhook"
./stripe.sh $nftenv $region
