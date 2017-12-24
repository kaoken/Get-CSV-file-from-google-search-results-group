
/**
 * 数値を日本表記の円に換える
 * @param {int} price 数値
 * @returns {string}
 */
export function convertYENtoJapaneseFormat(price)
{
    var ret='',i=0,d=1000000000000;
    var a  = ['京','億','万'];
    do{
        if( price >= d){
            ret += (parseInt(price / d)+'').replace( /(\d)(?=(\d{3})+(?!\d))/g, '$1,') + a[i];
        }
        price %= d;
        d /= 10000;
    }while( ++i < 3 );
    if( price !== 0 ) ret += (price+'').replace( /(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    if(ret.length === 0)ret='0';
    return ret + ' 円';
}