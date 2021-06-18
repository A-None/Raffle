import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import useWindowDimensions from "hooks/useWindowDimensions";
import { Modal, Text } from "rimble-ui";
import BodyText from "./BodyText";
import {
  StyledModalContainer,
  StyledModalHeader,
  StyledModalBody,
} from "./style";

function MechanicsModal(props) {
  const modalRef = useRef(null);
  const closeModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      props.toggleModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeModal);
  });

  const { height } = useWindowDimensions();

  return (
    <Modal isOpen={props.isOpen}>
      <StyledModalContainer ref={modalRef}>
        <StyledModalHeader>
          <Text.p color="grey4" fontFamily="Roboto-Medium" fontSize={20} m={0}>
            Mechanics
          </Text.p>
        </StyledModalHeader>
        <StyledModalBody maxHeight={height - height / 5}>
          <BodyText>Lottery Ticket Fee for 1 ticket: 10 anone</BodyText>
          <BodyText>Single User Lottery Entry Limit: No limit</BodyText>
          <BodyText>
            Paying for one ticket (10 anone) will give users a random 4 digit
            combination with each digit being between 0–9, for e.g. “2–9–0–6”
          </BodyText>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Regular"
            fontSize={16}
            my={[16]}
          >
            In the event that no participants were able to match 3 numbers on
            any draw, the 20% allocated to winners will then be burned
            accordingly.
          </Text.p>
          <BodyText>
            For example, if the final 4 winning numbers are “2–9–0–6”:
          </BodyText>
          <BodyText>“2–9–0–6” = match all 4</BodyText>
          <BodyText>“2–9–5–6” = match 3</BodyText>
          <BodyText>“2–9–0–9” = match 3</BodyText>
          <BodyText>“2–9–6–0” = match 2</BodyText>
          <BodyText>- “2–3–0–1” = match 2</BodyText>
          <BodyText>- “0–9–0–2” = match 2</BodyText>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Medium"
            fontSize={20}
            mt={32}
            mb={0}
          >
            Timing
          </Text.p>
          <BodyText>
            Each raffle session is completed every 24 hours with the draw for
            each session at 10pm Singapore time daily.
          </BodyText>
          <BodyText>
            For each raffle, 100,000 anone tokens are injected into the smart
            contract.
          </BodyText>
          <BodyText>
            For the New Year Raffle (once off), 300,000 anone tokens shall be
            injected into the smart contract.
          </BodyText>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Regular"
            fontSize={16}
            mt={16}
            mb={0}
          >
            Example:
          </Text.p>
          <BodyText>Phase 1 — Buy Tickets (11 PM to next day 9 PM)</BodyText>
          <BodyText>You have 23 hours to buy tickets.</BodyText>
          <BodyText>
            The lottery jackpot will accumulate at the top of the page with each
            ticket bought.
          </BodyText>
          <BodyText>
            Users will receive a ticket (comprised of 4 digits) for each 10 anone
            paid.
          </BodyText>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Regular"
            fontSize={16}
            mt={16}
            mb={0}
          >
            Phase 2 — Lottery Draw! (10 PM)
          </Text.p>
          <BodyText>
            The 4 winning lottery numbers are drawn and will appear on the page.
          </BodyText>
          <BodyText>
            Each participant’s winnings will be automatically calculated based
            on their ticket numbers and shown on the page.
          </BodyText>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Regular"
            fontSize={16}
            mt={16}
            mb={0}
          >
            Users can claim winnings if they have any.
          </Text.p>
          <BodyText>
            Users will also be able to see the lottery results: How many users
            matched all 4 numbers, 3 numbers and 2 numbers.
          </BodyText>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Regular"
            fontSize={16}
            mt={16}
            mb={0}
          >
            Phase 3 — Celebration and Sharing If you won, congrats!
          </Text.p>
          <BodyText>
            Share with your friends or in our community groups.
          </BodyText>
          <BodyText>The next lottery starts in 1 hour!</BodyText>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Medium"
            fontSize={20}
            mt={32}
            mb={0}
          >
            Winning Ratio
          </Text.p>
          <BodyText>
            POT A: Match all 4 numbers in the exact order = win 50% of the pot
            (or split the pot if more than 1 winner).
          </BodyText>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Regular"
            fontSize={16}
            mt={16}
            mb={0}
          >
            POT B: Match 3 numbers in the exact order = win or split 20% of the
            pot.
          </Text.p>
          <Text.p
            color="grey1"
            fontFamily="Roboto-Regular"
            fontSize={16}
            mt={16}
            mb={0}
          >
            POT C: Match 2 numbers in the exact order = win or split 10% of the
            pot. BURN POT: Burn remaining 20% of the pot.
          </Text.p>
        </StyledModalBody>
      </StyledModalContainer>
    </Modal>
  );
}

MechanicsModal.propTypes = {
  toggleModal: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default MechanicsModal;
