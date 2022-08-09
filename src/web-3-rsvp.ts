import { Address, ipfs, json } from "@graphprotocol/graph-ts"
import {
  ConfirmedAttendee,
  DepositsPaidOut,
  NewEventCreated,
  NewRSVP
} from "../generated/Web3RSVP/Web3RSVP"
import { Account, RSVP, Confirmation, Event } from "../generated/schema";
import { integer } from "@protofire/subgraphs-toolkit";

export function handleNewEventCreated(event: NewEventCreated): void {
  let newEvent = Event.load(event.params.eventId.toHex());
  if (newEvent == null) {
    newEvent = new Event(event.params.eventId.toHex());
    newEvent.eventId = event.params.eventId;
    newEvent.eventOwner = event.params.creatorAddress;
    newEvent.eventTimestamp = event.params.eventTimestamp;
    newEvent.maxCapacity = event.params.maxCapacity;
    newEvent.deposit = event.params.deposit;
    newEvent.paidOut = false;
    newEvent.totalRSVPs = integer.ZERO;
    newEvent.totalConfirmedAttendees = integer.ZERO;



    let metadata = ipfs.cat(event.params.eventDataCID + "/data.json");

    if (metadata) {
      const value = json.fromBytes(metadata).toObject();
      if (value) {
        const name = value.get("name");
        const description = value.get("description");
        const link = value.get("link");
        const imagePath = value.get("image");

        if (name) {
          newEvent.name = name.toString();
        }

        if (description) {
          newEvent.description = description.toString();
        }

        if (link) {
          newEvent.link = link.toString();
        }

        if (imagePath) {
          const imageURL =
            "https://ipfs.io/ipfs/" +
            event.params.eventDataCID +
            imagePath.toString();
          newEvent.imageURL = imageURL;
        } else {
          // return fallback image if no imagePath
          const fallbackURL = 
            "https://ipfs.io/ipfs/bafybeibssbrlptcefbqfh4vpw2wlmqfj2kgxt3nil4yujxbmdznau3t5wi/event.png"
          newEvent.imageURL = fallbackURL;
        }
      }
    }

    newEvent.save();
  }
}


export function handleNewRSVP(event: NewRSVP): void {}

export function handleDepositsPaidOut(event: DepositsPaidOut): void {}

export function handleConfirmedAttendee(event: ConfirmedAttendee): void {}

