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
    compareDNA(altPAequor) {
      if(this.specimenNum !== altPAequor.specimenNum) {
        const count = this.dna.reduce((acc, base, i) => {
          return base === altPAequor.dna[i] ? acc + 1 : acc;
        }, 0);
        const percentageInCommon = (count / 15 * 100).toFixed(2);

        console.log(`specimen #${this.specimenNum} and specimen #${altPAequor.specimenNum} have ${percentageInCommon}% DNA in common.`);
      }
    },
    willLikelySurvive() {
      const numOfBases = this.dna.reduce((acc, base) => {
        return base === 'C' || base === 'G' ? acc + 1 : acc;
      }, 0)
      const survivalPercent = numOfBases / this.dna.length * 100;
      console.log(survivalPercent)
      return survivalPercent >= 60 ? true : false;
    }
  };
}

const specimen1 = pAequorFactory(4, mockUpStrand())
const specimen2 = pAequorFactory(45, mockUpStrand())

console.log(specimen1)
// specimen1.mutate();
console.log('survive: ', specimen1.willLikelySurvive())
// console.log(specimen1)
// console.log(specimen2)
// console.log(specimen1.compareDNA(specimen2))






