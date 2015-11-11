/**
 * Created by danbunea on 03/03/15.
 */

jest.dontMock('../src/pi-react/pi-react.js');
jest.dontMock('../src/storyboard/storyboard_controller.js');

describe('pi-react.cursors GIVEN an immutable object', function() {
    pi = require('../src/pi-react/pi-react.js');


    it(' cannot be changed traditionally', function() {
        var initial_state = pi.deepFreeze({a:1});
        initial_state.a=2;
        expect(initial_state.a).toEqual(1);//cannot modify immutable object
    });


    it("can add trough cursors (paths) ", function() {
        var initial_state = pi.deepFreeze({a: 1});
        var new_state1 = pi.change("xyz", 2, initial_state);
        expect(initial_state.a).toEqual(1);//cannot modify old immutable object
        expect(new_state1.xyz).toEqual(2);//new immutable object

        var new_state2 = pi.change("xyz",34)(initial_state);
        expect(initial_state.a).toEqual(1);//cannot modify old immutable object
        expect(new_state2.xyz).toEqual(34);//new immutable object

    });

    it('can change using cursors', function() {
        var initial_state = pi.deepFreeze({a: 1});
        var new_state1 = pi.change("a", 2)(initial_state);
        expect(initial_state.a).toEqual(1);//cannot modify old immutable object
        expect(new_state1.a).toEqual(2);//new immutable object
    });


    it('can change nested', function() {
        initial_state = pi.deepFreeze({a: 1, b: {c: 3}});
        new_state1 = pi.change("b.c", 4.5, initial_state);
        expect(initial_state.b.c).toEqual(3);//cannot modify old immutable object
        expect(new_state1.b.c).toEqual(4.5);//new immutable object
    });

    it('is can change nested with arrays', function() {
        var initial_state = pi.deepFreeze({a:1, b:{c:3}, d:{e:[{g:100}, {h:200}]}});
        var new_state1 = pi.change("d.e[0].g",101, initial_state);
        expect(initial_state.d.e[0].g).toEqual(100);//cannot modify old immutable object
        expect(new_state1.d.e[0].g).toEqual(101);//new immutable object

        var new_state2 = pi.change("d.e",[{i:300}].concat(initial_state.d.e), initial_state);
        expect(initial_state.d.e[0].g).toEqual(100);//cannot modify old immutable object
        expect(new_state2.d.e.length).toEqual(3);//new immutable object has a list with 3 elements
        expect(new_state2.d.e[0].i).toEqual(300);//new immutable object

        new_state2.d.e[0].i=0.5;
        new_state2.d=0.7;
        expect(new_state2.d.e[0].i).toEqual(300);//new immutable object
    });


    it('can obtain values through pi_value', function() {
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}, d: {e: [
            {g: 100},
            {h: 200}
        ]}});
        //WHEN trying to get values using cursors
        var g = pi.value("d.e[0].g",initial_state);
        //ASSERT it is not changed
        expect(g).toEqual( 100);

        //WHEN trying different combinations
        expect(pi.value( "b.c", initial_state)).toEqual( 3);
        expect(pi.value("d.e[0].g", initial_state)).toEqual( 100);

        //WHEN tring wrong paths
        expect(pi.value("d.e[0].abc", initial_state)).toEqual( undefined);
        expect(pi.value("d.e[7]", initial_state)).toEqual( undefined);
    });


    it('can copy values from one place (cursor) to another', function() {
        //GIVEN an immutable object with nested arrays
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}, d: {e: [
            {g: 100},
            {h: 200}
        ]}});
        //WHEN trying to get values using cursors
        var after = pi.copy("d.e[0].g", "d.e[1].h", initial_state);
        //ASSERT it is not changed
        expect(after.d.e[0].g).toEqual( 100);
        expect(initial_state.d.e[1].h).toEqual( 200);
        expect(after.d.e[1].h).toEqual( 100);
    });

    it('can delete values from one place (cursor) ', function() {
        //GIVEN an immutable object with nested arrays
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3, x:4}, d: {e: [
            {g: 100},
            {h: 200}
        ]}});
        //WHEN trying to gdelete
        var xx = pi.delete("b.x", initial_state)
        //ASSERT it it is removed
        expect(xx.hasOwnProperty("x")).toBeFalsy();//Equal( false);
    });






    it("can copy values from one place (cursor) to another - pi_move ", function (assert) {
        //GIVEN an immutable object with nested arrays
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}, d: {e: [
            {g: 100},
            {h: 200}
        ]}});
        //WHEN trying to get values using cursors
        var after = pi.move("d.e[0].g", "d.e[1].h", initial_state);
        //ASSERT it is not changed
        expect(initial_state.d.e[1].h).toEqual( 200);
        expect(after.d.e[1].h).toEqual( 100);
        expect(after.d.e[0].hasOwnProperty("g")).toBeFalsy();

    });

    it("can change multiple values at once - pi_change_multi", function (assert) {
        //GIVEN an immutable object with nested arrays
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}, d: {e: [
            {g: 100},
            {h: 200}
        ]}});
        //WHEN trying to get values using cursors
        var after = pi.change_multi({
                "d.e[0].g":101,
                "d.e[1].h":201,
                "a":2,
                "xyz":2,
                "b.c":4.5
            }, initial_state);
        //ASSERT it is not changed
        expect(initial_state.d.e[0].g).toEqual( 100);
        expect(initial_state.d.e[1].h).toEqual( 200);

        expect(after.d.e[0].g).toEqual( 101);
        expect(after.d.e[1].h).toEqual( 201);
        expect(after.a).toEqual(2);
        expect(after.xyz).toEqual(2);
        expect(after.b.c).toEqual(4.5);

    });

});

describe("pi-react equals", function()
{
    it('should be equal, no changes', function() {
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}});
        var final_state = initial_state
        expect(pi.equals(initial_state, final_state)).toBeTruthy();
    });




    it('should be equal, changes to the same value, and first level', function() {
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}});
        var final_state = pi.pi_change(initial_state, "a", 1);
        expect(pi.equals(initial_state, final_state)).toBeTruthy();
    });

    it('should NOT be equal, changes to the same value, but deep', function() {
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}});
        var final_state = pi.pi_change(initial_state, "b.c", 3);
        expect(pi.equals(initial_state, final_state)).toBeFalsy();
        var final_state = pi.pi_change(initial_state, "b.c", 18365);
        expect(pi.equals(initial_state, final_state)).toBeFalsy();
    });



    it('should be equal, deeply if values are compared deeply', function() {
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}, d:{e:{f:4}}});
        var final_state = pi.pi_change(initial_state, "b.c", 3);


        var i_b = pi.pi_value(initial_state, "b")
        var f_b = pi.pi_value(final_state, "b")

        expect(pi.equals(i_b,f_b)).toBeTruthy();//i.b.c===f,b.c===3

    });

    it('should NOT be equal, deeply if values are compared deeply, and differ', function() {
        var initial_state = pi.deepFreeze({a: 1, b: {c: 3}, d:{e:{f:4}}});
        var final_state = pi.pi_change(initial_state, "d.e.f", 4);


        var ide = pi.pi_value(initial_state, "d")
        var fde = pi.pi_value(final_state, "d")


        expect(pi.equals(ide,fde)).toBeFalsy();//{e:{f:4}}!=={e:{f:4}}

    });


    it("should consider both equal", function(){
        var a = {page_number:2, no_of_pages:4};
        var b = {page_number:2, no_of_pages:4};

        expect(pi.equals(a,b)).toBeTruthy();
    })

    it("should compare corectly", function(){
        var a = pi.deepFreeze(
            {
                a:"",
                b:[{x:1},{x:2}],
                c:false}
        );

        var b = pi.pi_change(a, "a","p");

        expect(pi.equals(b.a, a.a, true)).toBeFalsy()
    })
    it("should ignore functions", function(){
        var a = function(){return 1};
        var b =function(a){return 2};

        expect(pi.equals(b, a, true)).toBeTruthy();
    })
})


