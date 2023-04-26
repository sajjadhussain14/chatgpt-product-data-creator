// ChatGPT   Integration
// Version : 1.0.2
// author: Sajjad Hussain

let maxTokens = 2000;
let model = "text-davinci-003";
let mode = "completions";
let temperature = 0.7;
let maxLen = 2048;
let topP = 1;
let frequencyPenalty = 0;
let presencePanalty = 0;

// CHANGE TEMPERATURE CONTROLS
const changeTemperature = () => {
  temperature = document.getElementById("gpt-temperature").value;
  document.getElementById("out-temperature").innerHTML = temperature;
};

// CHANGE MAXIMUM LENGTH CONTROLS
const changeMaxLen = () => {
  maxLen = document.getElementById("gpt-maxLen").value;
  document.getElementById("out-maxLen").innerHTML = maxLen;
};

//CHANGE TOP P cONTRAOLS
const changeTopP = () => {
  topP = document.getElementById("gpt-topP").value;
  document.getElementById("out-topP").innerHTML = topP;
};

// CHNAGE FREQUENCE PENALTY CONTROLS
const changeFrequency = () => {
  frequencyPenalty = document.getElementById("gpt-frequency").value;
  document.getElementById("out-frequency").innerHTML = frequencyPenalty;
};

// CHANGE PRESENCE PENALTY CONTROLS
const changePresence = () => {
  presencePanalty = document.getElementById("gpt-presence").value;
  document.getElementById("out-presence").innerHTML = presencePanalty;
};

// SHOW LOADER
const showLoder = () => {
  document.getElementById("spinner").style.visibility = "visible";
  document.getElementById("spinner").style.opacity = 1;
};

// HIDE LOADER
const hideLoder = () => {
  document.getElementById("spinner").style.visibility = "hidden";
  document.getElementById("spinner").style.opacity = 0;
};

// GENERATE DATA REQUEST
const generateData = () => {
  showLoder();
  const targets = [
    "title",
    "description",
    "comma separated keywords",
    "long description",
    "short description",
  ];

  let productName = document.getElementById("prompt").value.trim();
  if (productName == "") {
    alert("Please enter a product name");
    hideLoder();
    return;
  }

  // RESET IMPUTS BEFORE REQUEST
  targets.map((param) => {
    let paramID = param.replaceAll(" ", "-").trim();
    document.getElementById(paramID).innerHTML = "";
  });

  // ITERATE FOR ALL FIELDS
  targets.map((param) => {
    let paramID = param.replaceAll(" ", "-").trim();
    let textPosition = 0;
    let speed = 5;

    // CONSTRUCTING PROMPT
    let prompts = "";
    let agent = "Prompt: \n";
    let action = " generate " + " " + param.toUpperCase() + " \n";
    let intent = "";
    let adittionalInfo = "";
    try {
      adittionalInfo = document.getElementById("a" + paramID).value;
    } catch (err) {}
    if (adittionalInfo && adittionalInfo.trim().length > 0) {
      adittionalInfo = " and also in " + param + " " + adittionalInfo + " ";
      prompts =
        agent + action + intent + " of product " + productName + adittionalInfo;
    } else {
      prompts = agent + action + intent + " of product " + productName;
    }

    // REQUEST SETTINGS
    let settings = {
      async: true,
      crossDomain: true,
      url: "src/components/productData.cfc?method=generateData",
      method: "POST",
      data: {
        prompts: prompts,
        maxTokens: maxTokens,
        model: model,
        mode: mode,
        temperature: temperature,
        maxLen: maxLen,
        topP: topP,
        frequencyPenalty: frequencyPenalty,
        presencePanalty: presencePanalty,
      },
    };

    // MAKING REQUEST WITH PARAMS
    $.ajax(settings).done(function (response) {
      // START TYPE WRITE FUNCTION
      const typeWriter = () => {
        let res = [];
        res.push(response);
        let spanID = paramID + "span";
        document.getElementById(paramID).innerHTML =
          res[0].substring(0, textPosition) +
          `<span id=${spanID} class='blinkMe'>\u25ae</span>`;
        if (textPosition++ < res[0].length) {
          setTimeout(typeWriter, speed);
        } else {
          setTimeout(() => {
            document.getElementById(spanID).remove();
          }, 3000);
        }
      };
      // END TYPE WRITE FUNCTION
      response = response.replaceAll('"', "").trim();
      try {
        typeWriter();
      } catch (err) {
        typeWriter();
      }
      hideLoder();
    });
  });
};

// CALLING API ON ENTER
let promptBox = document.getElementById("prompt");
promptBox.addEventListener("keyup", (e) => {
  if (e.code == "Enter") {
    generateData();
  }
});
