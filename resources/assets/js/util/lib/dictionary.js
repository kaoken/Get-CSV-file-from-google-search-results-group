/**
 *
 * @returns {object}
 */
export function utilDictionary() {
    return {
        a:[],
        insert:function (obj) {
            this.a.unshift(obj);
            this.sort();
        },
        sort:function(){
            var n = this.a.length;
            for (var i = 1; i < n; i++)
                for (var j = i; j >= 1 && a[j - 1] > a[j]; --j )
                    this.a[j] = [this.a[j - 1],this.a[j - 1]=this.a[j]][0];
        },
        find:function (key) {
            var r = this.findRetAddIdx(key);
            if( r !== null ) return r.data;
            return null;
        },
        findRetAddIdx:function (key) {
            var left = 0;
            var right = this.a.length;
            var mid = 0;
            while (left < right) {
                mid = (left + right) / 2;
                if( this.a[mid] == key)
                    return {idx:mid, data:this.a[mid]};
                else if( key < this.a[mid] )
                    right = mid;
                else
                    left = mid + 1;
            }
            return null;
        },
        /**
         * 指定位置の配列の要素を削除する
         * @param {integer} idx 添字
         * @return {boolean}
         */
        eraserIdx:function (idx) {
            if( this.a.length <= idx)return false;
            this.a.splice(idx, 1);
            return true;
        },
        /**
         * 指定したキーの要素を削除する
         * @param {string|integer} key
         * @return {boolean}
         */
        eraser:function (key) {
            var r = this.findRetAddIdx(key);
            if( r !== null){
                return this.eraserIdx(r.idx);
            }
            return false;
        }
    };
}