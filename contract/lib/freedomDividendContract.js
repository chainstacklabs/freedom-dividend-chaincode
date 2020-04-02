'use strict';
const { Contract} = require('fabric-contract-api');

class FreedomDividendContract extends Contract {

   /** Opt in
    * 
    * Let those willing to opt in to the Universal Basic Income program
    * provide their Social Security number and an opt-in.
    * 
    * This write the transaction to the ledger and update the world state.
    * 
    * @param ctx - the context of the transaction
    * @param ssnId - a Social Security number
    * @param optedIn - an opt-in value
    */
   async optIn(ctx,ssnId,optedIn) {
   
    let ssn={
       opt:optedIn,
       };

    await ctx.stub.putState(ssnId,Buffer.from(JSON.stringify(ssn))); 
    
    console.log('This Social Security number has successfully opted in to Freedom Dividend.');
    
  }

  /** Opt out
   * 
   * If a citizen has opted in to the Universal Basic Income program, they now
   * have the option to opt out. All they need to do is provide their
   * Social Security number.
   * 
   * The opt-out is basically a transaction to the ledger that removes the
   * existing Social Security number from the world state.
   * 
   * @param ctx - the context of the transaction
   * @param ssnId - a Social Security number
   */
   async optOut(ctx,ssnId) {

    await ctx.stub.deleteState(ssnId); 
    
    console.log('This Social Security number has successfully opted out of Freedom Dividend.');
    
    }

  /** Query a Social Security Number that has opted in
   * 
   * If a citizen has opted in the Universal Basic Income program, their
   * Social Security number can now be queried from the world state to
   * include them in the monthly Freedom Dividend distribution.
   * 
   * @param ctx - the context of the transaction
   * @param ssnId - a Social Security number
   */
   async querySSN(ctx,ssnId) {
   
      let ssnAsBytes = await ctx.stub.getState(ssnId); 
      if (!ssnAsBytes || ssnAsBytes.toString().length <= 0) {
        throw new Error('This Social Security number is not opted in to Freedom Dividend.');
         }
        let ssn=JSON.parse(ssnAsBytes.toString());
        
        return JSON.stringify(ssn);
       }
}

module.exports=FreedomDividendContract;