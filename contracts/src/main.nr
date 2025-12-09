use dep::aztec::macros::aztec;

#[aztec]
pub contract XmasLetterbox {
    use aztec::{
        macros::{functions::external, events::event},
        protocol_types::address::AztecAddress,
        messages::message_delivery::MessageDelivery,
    };

    #[event]
    struct XmasLetter {
        message: Field,
    }

    #[external("private")]
    fn send_letter(to: AztecAddress, message: Field) {
        // Implementation for sending a letter
        // 2. emit an event with the encrypted message
        self.emit(XmasLetter { message }, to, MessageDelivery.UNCONSTRAINED_ONCHAIN);
    }
}
