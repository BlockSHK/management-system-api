# Software Subscription and License Management System - Data Model

## License

License represents a both license contract and end user license token or end user subscription.

```
{
    "id": "501c78a4-49a2-488e-8336-091be3e2843f",
    "software": "c2186403-5a6a-4fb7-90a6-543d7bba7784",
    "type": "CONTRACT",
    "name": "Microsoft Office - Premimum",
    "description": "Premimum package for the microsoft office 2003. License valid",
    "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
    "status": "ACTIVE",
    "owner": "a0310c2a-ca87-421e-9235-dfadf323b412",
    "contract": {
        "blockchain": "ETHEREUM",
        "address": "0x86758d1c5ab95ff324f7e0b2cdec38c86eebe768",
        "type": "PERPETUAL",
        "metadata": {
            ... metadata
        }
    },
}
```

```
{
    "id": "34b98547-e614-4c80-9245-bcdca6eabbc9",
    "software": "c2186403-5a6a-4fb7-90a6-543d7bba7784",
    "type": "TOKEN",
    "name": "Microsoft Office - Premimum",
    "description": "Premimum package for the microsoft office 2003. License valid",
    "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
    "status": "ACTIVE",
    "owner": "0d170326-494b-43b8-8d49-d1ec74e84d97",
    "contract": {
        "blockchain": "ETHEREUM",
        "address": "0x86758d1c5ab95ff324f7e0b2cdec38c86eebe768",
        "type": "PERPETUAL",
        "metadata": {
            ... metadata
        }
    },
    "token": {
        "id": 123,
        "metadata": {
            ... metadata
        }
    },

}
```

```
{
    "id": "34b98547-e614-4c80-9245-bcdca6eabbc9",
    "software": "c2186403-5a6a-4fb7-90a6-543d7bba7784",
    "type": "SUBSCRIPTION",
    "name": "Microsoft Office - Premimum",
    "description": "Premimum package for the microsoft office 2003. License valid",
    "image": "https://www.nichemarket.co.za/admin/Content/images/metaDisplayImages/google-logo-805x452.jpg",
    "status": "ACTIVE",
    "owner": "0d170326-494b-43b8-8d49-d1ec74e84d97",
    "contract": {
        "blockchain": "ETHEREUM",
        "address": "0x86758d1c5ab95ff324f7e0b2cdec38c86eebe768",
        "type": "PERPETUAL",
        "metadata": {
            ... metadata
        }
    },
    "subscription": {
        "id": 123,
        "metadata": {
            ... metadata
        }
    },

}
```

- `id` (uuidv4, immutable) is a unique identifier for the license within the system.
- `software` (uuidv4, optional) is the id of the software that the license belongs to.
- `type` (string, enum) represents the type of the license. Possible values are;
  - CONTRACT_PERPETUAL - license is a contract of perpetual license
  - CONTRACT_SUBSCRIPTION - license is a contract to create subscription
  - TOKEN_PERPETUAL - End User license token which minted
  - TOKEN_SUBSCRIPTION - End User Subscription
- `name` (string) is the name of the license.
- `description` (string) is a description of the license.
- `image` (string, url) is a URL that contains an image representing the license.
- `status` (string, enum) represents the current status of the license. Possible values are;
  - ACTIVE - License is active and should be visible to customers
  - INACTIVE - License is inactive and should not be visible to customers
- `owner` (uuidv4, immutable) is the id of the user that owns the license.
- `contract` (object, optional) represents the contract associated with this license. It has the following properties.
  - `blockchain` (string, enum) is the blockchain hosting the contract. Possible values are;
    - ETHEREUM - Ethereum
  - `address` (string, address) is the address of the contract.
  - `type` (string, enum) is the type of the contract. Possible values are;
    - PERPETUAL
    - SUBSCRIPTION
  - `metadata` (object) is a JSON metadata for the contract.
- `token` (object, optional) represents the minted token (if any) associated with the license.
  - `id` (number) is the token id within the contract for the token.
  - `metadata` (object) is a JSON metadata for the minted token.
- `token` (object, optional) represents the subscription associated with the license.
  - `id` (number) is the subscription id within the contract.
  - `metadata` (object) is a JSON metadata for the subscriptino.

## Software

Software represents set of license related to one software.

```
{
    "id": "bd7b7740-3f44-4238-a834-4606621b6ba6",
    "category": "ART",
    "name": "Microsoft Word 2016",
    "description": "Microsoft Word 2016 software for document editing",
    "image": "https://i0.wp.com/isoriver.com/wp-content/uploads/2019/11/word-2016.jpg?w=920&ssl=1",
    "owner": "a0310c2a-ca87-421e-9235-dfadf323b412",
}
```

- `id` (uuidv4, immutable) is the unique identifier of the software.
- `category` (string, enum) is the category of the software. Possible values are;
  - SYSTEM - System Software
  - APPLICTION - Application Software
- `name` (string) is the name of the software.
- `description` (string) is the description of the software.
- `image` (string, url) is a URL containing an image representing the software.
