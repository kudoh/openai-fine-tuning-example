# OpenAI Fine-Tuning Example by JavaScript

## Precondition

Get the OpenAPI API key and set it to an environment variable.

```shell
export OPENAI_API_KEY=<your api key>
```

## Train

Specify a JSONL-formatted training file and execute the following.

```shell
# Optionally you can use n_epochs after file path
npm run train sample.jsonl
```

After a while, the fine-tuned model name will be output on the console.

## Analyze

To check the result of fine-tuning, refer to job events or `result_file`.

```shell
# get result_file from training job
npm run list-jobs

# list job event
npm run list-event <job-id>

# show result-file
npm run get-files <result_file-id>
```

## Test the fine-tuned model

Test with a fine-tuned model name and any prompts.

```shell
npm run chat -- <model-name> "<prompt>"
```