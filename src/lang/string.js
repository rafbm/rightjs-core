/**
 * The String class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The trim function taken from work of Steven Levithan
 *     - http://blog.stevenlevithan.com/archives/faster-trim-javascript
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(String.prototype, (function() {
  
  // predefining the regular expressions to speed the things up
  
  var SPACES_ONLY_RE         = /^\s*$/,
      START_SPACES_RE        = /^\s\s*/,
      SOME_SPACE_RE          = /\s/,
      STRIP_TAGS_RE          = /<\/?[^>]+>/ig,
      STRIP_SCRIPTS_RE       = /<script[^>]*>([\s\S]*?)<\/script>/img,
      START_DASHES_RE        = /^(\-|_)+?/g,
      SOME_DASH_RE           = /\-|_/,
      ALL_DASHES_RE          = /\-/g,
      DASH_PLUS_UPCASE_RE    = /(\-|_)+?(\D)/g,
      CASE_CHANGE_RE         = /([a-z0-9])([A-Z]+)/g,
      LOWCASED_WORD_START_RE = /(^|\s|\-|_)[a-z\u00e0-\u00fe\u0430-\u045f]/g,
      FLOAT_DIGIT_RE         = /(\d)-(\d)/g;
  
return {
  /**
   * checks if the string is an empty string
   *
   * @return boolean check result
   */
  empty: function() {
    return this == '';
  },
  
  /**
   * checks if the string contains only white-spaces
   *
   * @return boolean check result
   */
  blank: function() {
    return SPACES_ONLY_RE.test(this);
  },
  
  /**
   * removes trailing whitespaces   
   *
   * @return String trimmed version
   */
  trim: String.prototype.trim || function() {
    var str = this.replace(START_SPACES_RE, ''), i = str.length;
    while (SOME_SPACE_RE.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  },
  
  /**
   * returns a copy of the string with all the tags removed
   * @return String without tags
   */
  stripTags: function() {
    return this.replace(STRIP_TAGS_RE, '');
  },
  
  /**
   * removes all the scripts declarations out of the string
   * @param mixed option. If it equals true the scrips will be executed, 
   *                      if a function the scripts will be passed in it
   * @return String without scripts
   */
  stripScripts: function(option) {
    var scripts = '';
    var text = this.replace(STRIP_SCRIPTS_RE, function(match, source) {
      scripts += source.trim() + "\n";
      return '';
    });
    
    if (option === true)
      $eval(scripts);
    else if (isFunction(option))
      option(scripts, text);
    else if (isNumber(option))
      $eval.bind(scripts).delay(options);
    
    return text;
  },
  
  /**
   * extracts all the scripts out of the string
   *
   * @return String the extracted stcripts
   */
  extractScripts: function() {
    var scripts = '';
    this.stripScripts(function(s,t) { scripts = s; });
    return scripts;
  },
  
  /**
   * evals all the scripts in the string
   *
   * @return String self (unchanged version with scripts still in their place)
   */
  evalScripts: function() {
    $eval(this.extractScripts());
    return this;
  },
  
  /**
   * converts underscored or dasherized string to a camelized one
   * @returns String camelized version
   */
  camelize: function() {
    var prefix = this.match(START_DASHES_RE) || ''; // <- keeps start dashes alive
    return prefix + this.substr(prefix.length, this.length).replace(
       DASH_PLUS_UPCASE_RE, function(match) {
         return match.replace(SOME_DASH_RE, '').toUpperCase();
      });
  },
  
  /**
   * converts a camelized or dasherized string into an underscored one
   * @return String underscored version
   */
  underscored: function() {
    return this.replace(CASE_CHANGE_RE, function(match, first, second) {
      return first+"_"+(second.length > 1 ? second : second.toLowerCase());
    }).replace(ALL_DASHES_RE, '_');
  },

  /**
   * returns a capitalised version of the string
   *
   * @return String captialised version
   */
  capitalize: function() {
    return this.replace(LOWCASED_WORD_START_RE, function(match) {
      return match.toUpperCase();
    });
  },
  
  /**
   * checks if the string contains the given substring
   *
   * @param String string
   * @return boolean check result
   */
  includes: function(string) {
    return this.indexOf(string) != -1;
  },
  
  /**
   * checks if the string starts with the given substring
   *
   * @param String string
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  startsWith: function(string, ignorecase) {
    var start_str = this.substr(0, string.length);
    return ignorecase ? start_str.toLowerCase() == string.toLowerCase() : 
      start_str == string;
  },
  
  /**
   * checks if the string ends with the given substring
   *
   * @param String substring
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  endsWith: function(string, ignorecase) {
    var end_str = this.substring(this.length - string.length);
    return ignorecase ? end_str.toLowerCase() == string.toLowerCase() :
      end_str == string;
  },
  
  /**
   * converts the string to an integer value
   * @param Integer base
   * @return Integer or NaN
   */
  toInt: function(base) {
    return parseInt(this, base || 10);
  },
  
  /**
   * converts the string to a float value
   * @param boolean flat if the method should not use a flexible matching
   * @return Float or NaN
   */
  toFloat: function(strict) {
    return parseFloat(strict ? this : this.replace(',', '.').replace(FLOAT_DIGIT_RE, '$1.$2'));
  }
  
};})());

$alias(String.prototype, {include: 'includes'});