var Hotsauce = {
    FirebaseObject : {
        _path : null,
        _serialize : function() {
            var val = {};
            for(prop in this) {
                if(prop !== '_path' && !$.isFunction(this[prop])) {
                    val[prop] = this[prop];
                }
            }
            return val;
        },
        _deserialize : function(val) {
            for(prop in val) {
                this[prop] = val[prop];
            }
        },
        _callback : function(self, callback, error) {
            if(callback) {
                if(error && callback.error) {
                    callback.error.call(self, error);
                } else if(callback.success) {
                    callback.success.call(self);
                }
            }
        },
        save : function(callback) {
            var self = this;
            var ref = Hotsauce.fb.child(self._path);
            ref.set(self._serialize(), function(error) {
                self._callback(self, callback, error);
            });
        },
        load : function(callback) {
            var self = this;
            var ref = Hotsauce.fb.child(self._path);
            ref.once('value', function(snapshot) {

                var val = snapshot.val();

                if(val === null) {
                    self._callback(self, callback, 'No such object');
                } else {
                    self._deserialize(snapshot.val());
                    self._callback(self, callback);
                }

            }, function (error) {
                self._callback(self, callback, error);
            });
        },
        destroy : function(callback) {
            var self = this;
            var ref = Hotsauce.fb.child(self._path);
            ref.set(null, function(error) {
                self._callback(self, callback, error);
            });
        }
    },
    extend : function(path) {
        var obj = {};
        $.extend(obj, this.FirebaseObject);
        obj._path = path;
        return obj;
    },
    init : function(path) {
        this.fb = new Firebase(path);
    }
};
