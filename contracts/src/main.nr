use dep::aztec::macros::aztec;

#[aztec]
pub contract XmasLetterbox {
    use aztec::{
        macros::{functions::{external, initializer}, events::event},
        protocol_types::address::AztecAddress,
        messages::message_delivery::MessageDelivery,
        event::event_emission::emit_event_in_private,
    };

    #[event]
    struct XmasLetter {
        message: Field,
    }

    #[external("public")]
    #[initializer]
    fn constructor() {}

    #[external("private")]
    fn send_letter(to: AztecAddress, message: Field) {
        // Emit an encrypted event with the message
        emit_event_in_private(
            XmasLetter { message },
            &mut context,
            to,
            MessageDelivery.UNCONSTRAINED_ONCHAIN,
        );
    }
}
