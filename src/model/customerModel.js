export default class CustomerModel{

    constructor(id,name,address,salary){
        this.id = id;
        this.name = name;
        this.address = address;
        this.salary = salary;
    }

    set id(value) {
        this._id = value;
    }

    set name(value) {
        this._name = value;
    }

    set address(value) {
        this._address = value;
    }

    set salary(value) {
        this._salary = value;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get address() {
        return this._address;
    }

    get salary() {
        return this._salary;
    }


}