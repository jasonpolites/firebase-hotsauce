var Hotsauce = {
    FirebaseObject : {
        _isFunc : function(object) {
            return object && getClass.call(object) == '[object Function]';
        },
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
            var that = this;
            var ref = Hotsauce.fb.child(this._path);
            ref.set(this._serialize(), function(error) {
                if(callback) {
                    if(error && callback.error) {
                        callback.error.call(that, error);
                    } else if(callback.success) {
                        callback.success.call(that);
                    }
                }
            });
        },
        load : function(callback) {
            var that = this;
            var ref = Hotsauce.fb.child(this._path);
            ref.once('value', function(snapshot) {
                that._deserialize(snapshot.val());
                if(callback && callback.success) {
                    callback.success.call(that);
                }
            }, function (error) {
                if(callback && error && callback.error) {
                    callback.error.call(that, error);
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
