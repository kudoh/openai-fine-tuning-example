# OpenAI Fine-Tuning Example by JavaScript

## Precondition

Get the OpenAPI API key and set it to an environment variable.

```shell
export OPENAI_API_KEY=<your api key>
```

## Train

Specify a JSONL-formatted study file and execute the following.

```shell
npm run train -- sample.jsonl
```

After a while, the fine-tuned model name will be output on the console.

## Test

Test with a fine-tuned model name and any prompts.

```shell
npm run chat -- <model-name> "<prompt>"
```