import OpenAI from 'openai';
import * as fs from 'fs';

const openapi = new OpenAI();

async function train(args: string[]) {
  const [file] = args;
  console.log('file', file);
  if (!file) throw new Error('no file given');
  const fileCreateResp = await openapi.files.create({
    file: fs.createReadStream(file),
    purpose: 'fine-tune'
  });
  // wait until file upload processed
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    const files = await openapi.files.list();
    const target = files.data.find(file => file.id === fileCreateResp.id)
    if (target) {
      if (target.status === "processed") {
        break;
      } else if (target.status === 'error' || target.status === 'deleting' || target.status === 'deleted') {
        throw new Error(target.status_details || "no details");
      }
    }
  }

  const jobResp = await openapi.fineTuning.jobs.create({
    model: 'gpt-3.5-turbo',
    training_file: fileCreateResp.id
  });
  console.log(jobResp);

  // wait until fine-tuned
  let modelName;
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    const jobs = await openapi.fineTuning.jobs.list();
    const target = jobs.data.find(job => job.id === jobResp.id);
    if (target) {
      if (target.status === 'succeeded') {
        modelName = target.fine_tuned_model;
        break;
      } else if (target.status === 'failed' || target.status === 'cancelled') {
        throw new Error(`job failed. status:${target.status}`)
      }
      console.log("status:", target.status)
    } else {
      throw new Error("job not found")
    }
  }
  console.log('fine-tuned model name', modelName);
}

async function listJobs() {
  console.log(await openapi.fineTuning.jobs.list());
}

async function chat(args: string[]) {
  const [model, message] = args;
  console.log('model', model);
  if (!model || !message) throw new Error('illegal param');
  const chatResp = await openapi.chat.completions.create({
    model: model,
    messages: [{
      content: message,
      role: 'user'
    }]
  });
  console.log(chatResp.choices[0].message);
}

const [command, ...rest] = process.argv.slice(2);
if (!command) {
  console.log('no command');
  process.exit(1);
}
let fn: (...args: any[]) => Promise<void>;
switch (command) {
  case 'train':
    fn = train;
    break;
  case 'listJobs':
    fn = listJobs;
    break;
  case 'chat':
    fn = chat;
    break;
  default:
    console.log('illegal command', command);
    process.exit(1);
}

fn(rest).then(() => console.log('finished')).catch(e => console.log({ e }));

