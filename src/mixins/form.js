export const form =  {
    methods: {
        recursionRef(arr) {
            const result = new Promise((resolve, reject) => {
                arr.forEach(item=>  {
                    item.validate(valid => {
                        if (valid) resolve('ok')
                        reject('refuse');
                    });
                    throw Error();
                })
            })
            return result;
        }
    },
}