export default function () {

  /* Link Harvester Utility*/

  'use strict';

  var Harvester = Harvester || {

    init: function () {
      this.cacheDOM();
      this.addEvent(this.bodyElement, 'click', this.getLinks.bind(this));
      this.addEvent(this.bodyElement, 'click', this.styleDOM.bind(this));
    },

    addEvent: function (target, eventType, eventHandler) {
      if (target) {
        target.addEventListener(eventType, eventHandler);
      }
    },

    cacheDOM: function () {
      this.bodyElement = document.querySelector('body');
      this.result_list = document.querySelector('.result__list');
      this.textInput = document.querySelector('.inputfield');

    },

    styleDOM: function () {
//         console.log(this.linkObject);

      let links = this.linkObject.links;
      let output = '';

        this.result_list.innerHTML = ' ';
        for (var item in links){
          output += `<li>${links[item].url}</li>`;
          }

        console.log(output);

        this.result_list.innerHTML = output;

    },

    getLinks: function (e) {
      this.linkObject = {};
      var  emailMatches = [],
        linkMatches = [],
        anchorMatches = [],
        emailPattern = /\b[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}/g,
//         linkAddressPattern = /\b(https?:\/\/)?\b([a-zA-Z]{2,3}\.)?\w+\.[a-zA-Z]{2,3}\b/g,
        linkAddressPattern = /(ftp:\/\/|www\.|https?:\/\/){1}[a-zA-Z0-9u00a1-\uffff0-]{2,}\.[a-zA-Z0-9u00a1-\uffff0-]{2,}(\S*)/g,
        linkTextPattern = />.+<\/a>/g,
        anchorPattern = /<a .*?>.*?<\/a>/g,
        textString = this.textInput.value;

      if (e.target.className === "harvest") {


        /////////////// EMAIL //////////////////////////
        //Get all Emails from Input
        let emailMatch = emailPattern.exec(textString);
        while (emailMatch !== null) {
          emailMatches.push(emailMatch[0]);
          emailMatch = emailPattern.exec(textString);
        }

        //Remove Email Address from textString
        for (let i = 0; i < emailMatches.length; i++) {
          textString = textString.replace(emailMatches[i], '');
        }
        //console.log(textString);

        // Add Emails to Object
        this.linkObject.emailAddresses = emailMatches;



        /////////////// LINK AND ANCHOR  //////////////////////////
        //Get Link and Anchors from Input
        let anchorMatch = anchorPattern.exec(textString);
        while (anchorMatch !== null) {
          anchorMatches.push(anchorMatch[0]);
          anchorMatch = anchorPattern.exec(textString);
        }

        //console.log(anchorMatches);

        //Get URL and Text from Anchors
        for (let i = 0; i < anchorMatches.length; i++) {
          if (linkAddressPattern.test(anchorMatches[i])) {
            //Get link and text and save in variable
            var hrefInAnchor = anchorMatches[i].match(linkAddressPattern).toString();
            var textInAnchor = anchorMatches[i].match(linkTextPattern).toString();
          }
          textInAnchor = textInAnchor.slice(1, textInAnchor.length - 4);
          linkMatches.push({
            url: hrefInAnchor,
            text: textInAnchor
          });

          //Remove Anchor Matches from textString
          textString = textString.replace(anchorMatches[i], '');
        }


        /////////////// OPTIONAL LINKS //////////////////////////
        //Get another Links without Anchortag
        var linkMatch = linkAddressPattern.exec(textString);
        while (linkMatch !== null) {
          linkMatches.push({
            url: linkMatch[0],
            text: ''
          });
          linkMatch = linkAddressPattern.exec(textString);
        }

        //Push data to Object
        this.linkObject.links = linkMatches;

        //console.log(this.linkObject);

        //RETURN OBJECT WITH ALL DATA/
        return this.linkObject;
      }
    }

  }//close Object Harvester


  Harvester.init();

}
