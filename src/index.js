import create from './create';
import append from './append';
import checkPrefix from './checkPrefix';
import recursePrefix from './recursePrefix';
import utils from './utils';
import config from './config';
import permutations from './permutations';

const PERMS_MIN_LEN = 2;

export default function(input) {
  if(!Array.isArray(input)) {
    throw(`Expected parameter Array, received ${typeof input}`);
  }

  const trie = create([...input]);

  return {
    /**
     * Get a string representation of the trie
    */
    dump(spacer = 0) {
      return utils.stringify(trie, spacer);
    },

    /**
     * Add a new word to the trie
     */
    addWord(word) {
      if(typeof word !== 'string' || word === '') {
        throw(`Expected parameter string, received ${typeof word}`);
      }

      const reducer = (...params) => {
        return append(...params);
      };

      const input = word.toLowerCase().split('');
      input.reduce(reducer, trie);

      return this;
    },

    /**
     * Remove an existing word from the trie
     */
    removeWord(word) {
      if(typeof word !== 'string' || word === '') {
        throw(`Expected parameter string, received ${typeof word}`);
      }

      const { prefixFound, prefixNode } = checkPrefix(trie, word);

      if(prefixFound) {
        delete prefixNode[config.END_WORD];
      }

      return this;
    },

    /**
     * Check a prefix is valid
     * @returns Boolean
    */
    isPrefix(prefix) {
      if(typeof prefix !== 'string' || prefix === '') {
        throw(`Expected string prefix, received ${typeof prefix}`);
      }

      const { prefixFound } = checkPrefix(trie, prefix);

      return prefixFound;
    },

    /**
    * Get a list of all words in the trie with the given prefix
    * @returns Array
    */
    getPrefix(strPrefix) {
      if(typeof strPrefix !== 'string' || strPrefix === '') {
        throw(`Expected string prefix, received ${typeof strPrefix}`);
      }

      if(!this.isPrefix(strPrefix)) {
        return [];
      }

      const { prefixNode } = checkPrefix(trie, strPrefix);

      return recursePrefix(prefixNode, strPrefix);
    },

    /**
    * Count the number of words with the given prefixSearch
    * @returns Number
    */
    countPrefix(strPrefix) {
      const prefixes = this.getPrefix(strPrefix);

      return prefixes.length;
    },

    /**
    * Get all words in the trie
    * @returns Array
    */
    getWords() {
      return recursePrefix(trie, '');
    },

    /**
    * Check the existence of a word in the trie
    * @returns Boolean
    */
    hasWord(word) {
      if(typeof word !== 'string') {
        throw(`Expected string word, received ${typeof word}`);
      }

      const { prefixFound, prefixNode } = checkPrefix(trie, word);

			if(prefixFound) {
      	return prefixNode[config.END_WORD] === 1;
      }

      return false;
    },

    /**
    * Get a list of valid anagrams that can be made from the given letters
    * @returns Array
    */
    getAnagrams(letters) {
      if(typeof letters !== 'string') {
         throw(`Anagrams expected string letters, received ${typeof letters}`);
      }

      if(letters.length < PERMS_MIN_LEN) {
        throw(`getAnagrams expects at least two letters`);
      }

      return permutations(letters, trie, {
        type: 'anagram'
      });
    },

    /**
    * Get a list of all sub-anagrams that can be made from the given letters
    * @returns Array
    */
    getSubAnagrams(letters) {
      if(typeof letters !== 'string') {
        throw(`Expected string letters, received ${typeof letters}`);
      }

      if(letters.length < PERMS_MIN_LEN) {
        throw(`getSubAnagrams expects at least two letters`);
      }

      return permutations(letters, trie, {
        type: 'sub-anagram'
      });
    },
  };
};
