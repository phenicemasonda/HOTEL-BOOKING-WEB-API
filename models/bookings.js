module.exports = function Bookings(bookedSuite) {

    this.items = bookedSuite.items || {};
    this.totalQty = bookedSuite.totalQty || 0;
    this.totalPrice = bookedSuite.totalPrice || 0;

    this.add = function(item, id, name, image) {
        var storedItem = this.items[id];
        if (!storedItem) {
              storedItem = this.items[id] = {item: item, name: name, image: image, qty: 0, price: 0} 
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id])
        }
        return arr;
    }
 } 
    


 