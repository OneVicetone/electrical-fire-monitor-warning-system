export const form =  {
    methods: {
        recursionRef(arr, cb) {
            const result = arr.map(item => {
                return new Promise((resolve, reject) => {
                    item.validate(valid => {
                        if (valid) resolve('ok')
                        reject('refuse');
                    });
                })
            })
            console.log(result)
            Promise.all(result).then(res=> {
                if ( cb && typeof cb === 'function' ) cb();
            }).catch(error=>this.log('我失败了', error))
        }
    },
}