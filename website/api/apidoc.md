# API Document

- [API Document](#api-document)
  - [API List](#api-list)
  - [GET /api/](#get-api)
    - [Description](#description)
    - [Response](#response)
  - [GET /api/generate](#get-apigenerate)
    - [Description](#description-1)
    - [Response](#response-1)
  - [GET /api/generate/<int:length>/](#get-apigenerateintlength)
    - [Description](#description-2)
    - [Response](#response-2)
  - [GET /api/generate/<string:len_type>/](#get-apigeneratestringlentype)
    - [Description](#description-3)
    - [Response](#response-3)
  - [POST /api/generate](#post-apigenerate)
    - [Description](#description-4)
    - [Request](#request)
    - [Response](#response-4)

## API List

- GET /api/
- GET /api/generate
- GET /api/generate/<int:length>/
- GET /api/generate/<string:len_type>/
- POST /api/generate

## GET /api/

### Description

Returns "Lorem Ipsum API". Use this endpoint to check if the API is running.

### Response

```text
"Lorem Ipsum API"
```

## GET /api/generate

### Description

Generates a random text with default params.

### Response

```json
{
  "loremText": "若是电力参加律与，解脱需要应付叫做他们着大得到检验他们价格机制。心上了给的针紧善于陕西以及...",
}
```

## GET /api/generate/<int:length>/

### Description

Generates a random text of specified character length.

### Response

```json
{
  "loremText": "若是电力参加律与，解脱需要应付叫做他们着大得到检验他们价格机制。心上了给的针紧善于陕西以及...",
}
```

## GET /api/generate/<string:len_type>/

### Description

Generates a random text based on the specified length type (tiny, small, short, medium, long).

### Response

```json
{
  "loremText": "若是电力参加律与，解脱需要应付叫做他们着大得到检验他们价格机制。心上了给的针紧善于陕西以及...",
}
```

## POST /api/generate

### Description

Generates a random text with custom params.

### Request

```json
{
    "num_paragraphs_range": [3, 5],
    "num_sentences_range": [4, 8],
    "max_sentence_length": 20
}
```

### Response

```json
{
  "loremText": "若是电力参加律与，解脱需要应付叫做他们着大得到检验他们价格机制。心上了给的针紧善于陕西以及...",
}
```
