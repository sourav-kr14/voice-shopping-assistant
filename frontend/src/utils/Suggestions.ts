import { getPurchaseHistory } from "./purchaseHistory";

export function getSuggestions():string[]
{
    const history=getPurchaseHistory();
    const today=Date.now();
    return history
    .filter((entry)=>{
        const daysSinceLast=(today-entry.lastPurchased)/(10000*60*60*24);
        return daysSinceLast>=entry.averageInterval;
    })
    .map((entry)=>entry.item);
}