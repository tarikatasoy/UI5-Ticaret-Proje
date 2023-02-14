sap.ui.define([
], function () {
    'use strict';

    var CachingHelper = {
        working: true,   //caching özelliğinin açık/kapalı durumu
        db: {},         //start edilmiş caching database listesi
        store_name: 'docs',

        /**
         * indexed db'yi başlatmak, açılacak db'leri belirlemek için
         * @typedef Idb
         * @property {String} name      database name
         * @property {Number} version   database version
         * 
         * @param {Boolean} working     caching db on/off
         * @param {Idb[]} databases     caching db list to open
         */
        initDb: function (working, databases) {
            return new Promise((resolve, reject) => {
                CachingHelper.working = working;
                if (!CachingHelper.working) return resolve(null);

                databases.forEach(db => {
                    console.time(db.name + " /open")

                    var req = indexedDB.open(db.name, db.version);

                    req.onupgradeneeded = (e) => {
                        var db = e.target.result;
                        if (db.objectStoreNames.length) {
                            Object.values(db.objectStoreNames)
                                .map(name => db.deleteObjectStore(name))
                        }
                        db.createObjectStore(CachingHelper.store_name, { keyPath: 'method' })
                    }
                    req.onsuccess = (e) => {
                        CachingHelper.db[db.name] = e.target.result;
                        Queue.dequeue(db.name, CachingHelper.db[db.name])
                        resolve(CachingHelper.db[db.name]);

                        console.timeEnd(db.name + " /open")
                    }

                    req.onblocked = reject;
                    req.onerror = reject;
                })
            })
        },

        /**
         * get, put.. isteklerine db sağlamak için
         * @param {String} db_name 
         * 
         * @returns {IDBDatabase || null}
         */
        openDb: function (db_name) {
            return new Promise(function (resolve) {
                if (!CachingHelper.working) return resolve(null);
                else if (CachingHelper.db[db_name]) return resolve(CachingHelper.db[db_name]);
                else return Queue.enqueue(db_name, resolve);
            })
        },
        /**
         * 
         * @param {IDBDatabase} db
         * @param {String} store_name 
         * @param {String} mode "readonly" or "readwrite"
         */
        objectStore: function (db, store_name, mode) {
            var tx = db.transaction(store_name, mode)
            return tx.objectStore(store_name);
        },
        /**
         * 
         * @param {IDBDatabase} db 
         */
        get: function (db, key) {
            return new Promise(function (resolve, reject) {
                var req = CachingHelper.objectStore(db, CachingHelper.store_name, 'readonly').get(key)

                req.onsuccess = function (e) {
                    var value = e.target.result
                    resolve(value)
                }
                req.onerror = reject;
            })
        },
        /**
         * 
         * @param {IDBDatabase} db 
         */
        getAll: function (db, query) {
            return new Promise(function (resolve, reject) {
                var req = CachingHelper.objectStore(db, CachingHelper.store_name, 'readonly').getAll(query)

                req.onsuccess = function (e) {
                    var value = e.target.result
                    resolve(value)
                }
                req.onerror = reject;
            })
        },
        /**
         * 
         * @param {IDBDatabase} db 
         */
        getAllKeys: function (db) {
            return new Promise(function (resolve, reject) {
                var req = CachingHelper.objectStore(db, CachingHelper.store_name, 'readonly').getAllKeys()

                req.onsuccess = function (e) {
                    var value = e.target.result
                    resolve(value)
                }
                req.onerror = reject;
            })
        },
        /**
         * 
         * @param {IDBDatabase} db 
         * @param {String} method method + '?' + params
         * @param {String} param 
         * @param {JSON} data 
         */
        put: function (db, method, param, data) {
            CachingHelper.objectStore(db, CachingHelper.store_name, 'readwrite').put({
                'method': method,
                'param': param,
                'data': data
            })
        },
    };

    var Queue = {
        elements: {},
        /**
         * db açıldığında işlenmek üzere isteklerin kuyruğa alınması
         * @param {String} db_name 
         * @param {Promise} callback db açıldığında tetiklenecek
         */
        enqueue: function (db_name, callback) {
            if (!this.elements[db_name]) this.elements[db_name] = []

            this.elements[db_name].push({
                db_name,
                callback
            })
        },
        /**
         * db açıldı, isteklere cevap dönülüyor
         * @param {String} db_name 
         * @param {IDBDatabase} db 
         */
        dequeue: function (db_name, db) {
            for (let i = this.countBy(db_name); i > 0; i--) {
                var q = this.elements[db_name].shift()
                q.callback(db)
            }
        },
        countBy: function (db_name) {
            return this.elements[db_name] ? this.elements[db_name].length : 0
        }
    }

    return CachingHelper;
});