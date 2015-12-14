import { readFile } from 'fs-promise';
export function descriptionQuestion() {
  return {
    name: 'description',
    message: 'Describe this project:',
    async when(answers, directory) {
      if ('description' in answers) {
        return false;
      }
      try {
        const description = JSON.parse(await readFile(`${directory}/package.json`, 'utf8')).description;
        if (description) {
          answers.description = description;
          return false;
        }
        return true;
      } catch (error) {
        return true;
      }
    },
  };
}
export default descriptionQuestion;
