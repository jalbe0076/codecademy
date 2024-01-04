// Returns a random DNA base
const returnRandBase = () => {
  const dnaBases = ['A', 'T', 'C', 'G'];
  return dnaBases[Math.floor(Math.random() * 4)];
};

// Returns a random single stand of DNA containing 15 bases
const mockUpStrand = () => {
  const newStrand = [];
  for (let i = 0; i < 15; i++) {
    newStrand.push(returnRandBase());
  }
  return newStrand;
};

const pAequorFactory = (num, dnaStrand) => {
  return {
    specimenNum: num,
    dna: dnaStrand,
    mutate() {
      const randomBase = Math.floor(Math.random() * this.dna.length)
      let newBase = returnRandBase();
      while(newBase === this.dna[randomBase]) {
        newBase = returnRandBase();
      }
      this.dna[randomBase] = newBase;
      return this.dna;
    },
  };
}







