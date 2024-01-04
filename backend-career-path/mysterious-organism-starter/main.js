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
        return percentageInCommon;
      }
    },
    willLikelySurvive() {
      const numOfBases = this.dna.reduce((acc, base) => {
        return base === 'C' || base === 'G' ? acc + 1 : acc;
      }, 0)
      const survivalPercent = numOfBases / this.dna.length * 100;

      return survivalPercent >= 60 ? true : false;
    },
    complementStrand() {
      return this.dna.reduce((acc, base) => {
        switch (base) {
          case 'G': 
            base = 'C';
            break;
          case 'C': 
            base = 'G';
            break;
          case 'T': 
            base = 'A';
            break;
          case 'A': 
            base = 'T';
            break;
        }
        acc.push(base);

        return acc;
      }, [])
    }
  };
}

const findRelatedInstances = (instance) => {
  let highestPercent = 0;
  let mostRelatedPair = [];

  for (let i = 0; i < instance.length; i++) {
    for (let j = i + 1; j < instance.length; j++) {
      const currentPercent = instance[i].compareDNA(instance[j]);
  
      if (highestPercent < currentPercent) {
        highestPercent = currentPercent;
        mostRelatedPair = [instance[i], instance[j]]
      }
    }
  }

  console.log(`The two most related instances are specimen #${mostRelatedPair[0].specimenNum} and specimen #${mostRelatedPair[1].specimenNum} with ${highestPercent}% DNA in common.`)
  return mostRelatedPair;
}

const pAequorInstances = [];

// Create 30 instances of pAequor that are likelly to survive
for (let i = 1; i <= 30; i++) {
  let newStrand = mockUpStrand();

  while (!pAequorFactory(i, newStrand).willLikelySurvive()) {
    newStrand = mockUpStrand();
  }
  
  pAequorInstances.push(pAequorFactory(i, newStrand));
}

console.log(pAequorInstances);
console.log(findRelatedInstances(pAequorInstances))
