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
        save : function(callback) {
            var self = this;
            var ref = Hotsauce.fb.child(self._path);
            ref.set(self._serialize(), function(error) {
                if(callback) {
                    if(error && callback.error) {
                        callback.error.call(self, error);
                    } else if(callback.success) {
                        callback.success.call(self);
                    }
                }
            });
        },
        load : function(callback) {
            var self = this;
            var ref = Hotsauce.fb.child(self._path);
            ref.once('value', function(snapshot) {
                self._deserialize(snapshot.val());
                if(callback && callback.success) {
                    callback.success.call(self);
                }
            }, function (error) {
                if(callback && error && callback.error) {
                    callback.error.call(self, error);
                }
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
