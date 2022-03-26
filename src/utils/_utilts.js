// convert text to TitleCase
const convertTextToTitleCase = (text) => {
  let camelCaseText = text
    .split(" ")
    .map(function (word, index) {
      // First character upper case else lower case
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
  return camelCaseText;
};
