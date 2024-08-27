export default class ItemModel{

    constructor(code,itemName,qty,price) {

        this.code = code;
        this.itemName = itemName;
        this.qty = qty;
        this.price = price;
    }


    get code() {
        return this._code;
    }

    set code(value) {
        this._code = value;
    }

    get itemName() {
        return this._itemName;
    }

    set itemName(value) {
        this._itemName = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }
}