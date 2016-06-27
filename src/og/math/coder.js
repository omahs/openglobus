goog.provide('og.math.coder');

goog.require('og.math');
goog.require('og.math.Vector4');

/**
 * Encode 32 bit float value to the RGBA vector.
 * @function
 * @param {nummer} f - 32 bit float value.
 * @returns {og.math.Vector4}
 */
og.math.coder.encodeFloatToRGBA = function (f) {
    var F = Math.abs(f);
    var s = og.math.step(0.0, -f);
    var e = Math.floor(og.math.log2(F));
    var m = (og.math.exp2(-e) * F);
    e = Math.floor(og.math.log2(F) + 127.0) + Math.floor(og.math.log2(m));
    return new og.math.Vector4(
		128.0 * s + Math.floor(e * og.math.exp2(-1.0)),
		128.0 * og.math.mod(e, 2.0) + og.math.mod(Math.floor(m * 128.0), 128.0),
        Math.floor(og.math.mod(Math.floor(m * og.math.exp2(23.0 - 8.0)), og.math.exp2(8.0))),
        Math.floor(og.math.exp2(23.0) * og.math.mod(m, og.math.exp2(-15.0)))
	);
};

/**
 * Decode RGBA vector to 32 bit float value.
 * @function
 * @param {og.math.Vector4} rgba - RGBA encoded 32 bit float value.
 * @returns {number}
 */
og.math.coder.decodeFloatFromRGBA = function (rgba) {
    var s = 1.0 - og.math.step(128.0, rgba.x) * 2.0;
    var e = 2.0 * og.math.mod(rgba.x, 128.0) + og.math.step(128.0, rgba.y) - 127.0;
    var m = og.math.mod(rgba.y, 128.0) * 65536.0 + rgba.z * 256.0 + rgba.w + 8388608.00;
    return s * og.math.exp2(e) * (m * og.math.exp2(-23.0));
};

/**
 * Separate 63 bit value to two 32 bit float values.
 * @function
 * @param {number} value - Double type value.
 * @returns {Array.<number,number>}
 */
og.math.coder.doubleToTwoFloats = function (value) {
    var high, low;
    if (value >= 0.0) {
        var doubleHigh = Math.floor(value / 65536.0) * 65536.0;
        high = Math.fround(doubleHigh);
        low = Math.fround(value - doubleHigh);
    } else {
        var doubleHigh = Math.floor(-value / 65536.0) * 65536.0;
        high = Math.fround(-doubleHigh);
        low = Math.fround(value + doubleHigh);
    }
    return [high, low];
};