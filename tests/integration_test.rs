
//use snake_game;

#[test]
fn test0() {
    let mut message = String::from("Hello");
    let message_2 = &mut message;
    let message_3 = message_2;
    
    message_3.push_str(" world");

    println!("{}", message_3);
    println!("{}", message);
}

#[test]
fn test1() {
    let a = 10;
    let b = &a;
    let c = &b;

    println!("{}", a == **c);
}

#[test]
fn test2() {
    let a = 10;
    let b = &a;
    let mut c = &b;
    let d = b;

    println!("before c: {}", c);

    let e = &&100;
    c = e;

    println!("a: {}", a);
    println!("after c: {}", c);

    println!("c: {:p}", c);
    println!("e: {:p}", e);
}

#[test]
fn test3() {
    let message = String::from("Hello");
    let message = extend_message(message);

    println!("{}", message);
}

fn extend_message(mut a:String) -> String {
    a.push_str(" World");
    a
}

#[test]
fn test4() {
    let message = String::from("Hello");
    let message = extend_message(message);

    let age = 30;
    extend_age(age);

    println!("age:{}", age);

    println!("message: {}", message);
}
 
fn extend_age(mut a:u32) {
    a += 100;
    println!("a:{}", a);
}

#[test]
fn test5() {
    let message = String::from("Hello");
    let message2 = &message;

    println!("message:{}", message);
    println!("message2:{}", message2);
    
}

#[derive(Copy, Clone)]
struct Point { x: i32, y: i32 }

#[test]
fn test6() {
    let mut p1 = Point{ x: -1, y: 2 };
    let p2 = p1;
    p1.x = 1;
    println!("p1: {}, {}", p1.x, p1.y);
    println!("p2: {}, {}", p2.x, p2.y);
}

#[test]
fn test7() {
    let mut message = String::from("Hello");
    let message_2 = &mut message;

    message_2.push_str(" World");
    
    println!("message_2:{}", message_2);
    println!("message:{}", message);
    
}

#[test]
fn test8() {
    let mut message = String::from("Hello");
    println!("message:{}", message);

    let message_2 = &mut message;

    unpredictable_mutate(message_2);

    //println!("message:{}", message);
    println!("message_2:{}", message_2);

}

fn unpredictable_mutate(val: &mut String) {
    val.push_str("_unpredictable");
}

#[test]
fn test9() {
    let mut message = String::from("Hello");
    let message_2 = &mut message;

    message_2.push_str(" World");
    (*message_2).push_str(" zhouzhou");

    println!("{}", message);

}

#[test]
fn test10() {
    let mut message = String::from("Hello");
    let message_2 = &mut message;
    let message_3 = &message_2;
    //message_3.push_str( "zhouzhou");
    println!("message_3:{}", message_3);
}

#[test]
fn test11() {
    let a = 10;
    let b = &a;

    println!("{}", a == *b);
}

#[test]
fn test12() {
    let a = 10;
    let b = &a;
    let c = &b;

    println!("{}", a == **c);
}

#[test]
fn test13() {
    let a = 10;
    let b = &a;
    let c = &b;
    let d = b;

    println!("Value of a: {}", a);
    println!("Value of b: {}", b);
    println!("Value of c: {}", c);
    println!("Value of d: {}", d);
}

#[test]
fn test14() {
    let a = 10;
    let b = &a;
    let c = &b;
    let d = b;

    println!("Value of a: {}", a);
    println!("Address of a: {:p}", &a);
    println!("Address of b: {:p}", b);
    println!("Address of c: {:p}", c);
    println!("Address of d: {:p}", d);
}

#[test]
fn test15() {
    let a = 10;
    let b = &a;
    let mut c = &b;
    let d = b;

    let e = &&100;
    c = e;

    println!("Value of c: {}", c);
    println!("Value of **c: {}", **c);
    println!("Value of *e: {}", *e);
    println!("Value of **e: {}", **e);

    println!("Address of c: {:p}", c);
    println!("Address of e: {:p}", e);


    println!("Address of 100: {:p}", &(**e));
    println!("Address of *c: {:p}", *c);
    println!("Address of *e: {:p}", *e);

    // println!("Value of a: {}", a);
    // println!("Address of a: {:p}", &a);
    // println!("Address of b: {:p}", b);
    // println!("Address of c: {:p}", c);
    // println!("Address of d: {:p}", d);
}


#[test]
fn test16() {
    let mut message = String::from("Hello");
    let slice = &message[2..4];
    let slice_1 = &message[..3];
    let slice_2 = &message[..];
    let slice_3 = &message[0..message.len()];
    let slice_4 = &message[2..];
    let slice_5 = &message[1..=3];
    
    //let slice_5 = &message[2..8];   //out of bounds

    println!("slice: {}", slice);
    println!("slice_1: {}", slice_1);
    println!("slice_2: {}", slice_2);
    println!("slice_3: {}", slice_3);
    println!("slice_4: {}", slice_4);
    println!("slice_5: {}", slice_5);
}

#[test]
fn test17() {
    let mut message = String::from("Hello");
    let message_3 = message.clone();

    message.clear();

    println!("message: {}", message);
    println!("message_3: {}", message_3);

}

/*
* P35 07-001box类型 02:10
*/
#[test]
fn test18() {
    let num = 32;
    let num_3 = Box::new(100);

    println!("{}", num_3);
}