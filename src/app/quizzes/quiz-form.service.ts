import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IUser } from '../_shared/models/user';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class QuizFormService {

  constructor() { }

  getCoreAndRegularPlayers(currentUser: IUser, users: IUser[]) {
    const corePlayers =  _.sortBy(users.filter(x => x.roles.includes('core') && x.id !== currentUser.id), x => x.name);
    const regularPlayers = _.sortBy(users.filter(x => x.roles.includes('regular')), x => x.name);

    if(currentUser.roles.includes('core')) {
      corePlayers.unshift(currentUser);
    }

    return [corePlayers, regularPlayers];
  }

  //put core and regular users in same object
  getMergedPlayers(corePlayers : IUser[], quizForm: FormGroup ) {
    let players: {[key:string]: boolean} = {};

    for(const [index, value] of quizForm.get('corePlayers')?.value.entries()) {
      if(value != null) {
        players[corePlayers[index].id!] = value;
      }
    }

    for(const playerId of quizForm.get('regularPlayers')?.value) {
      players[playerId] = true;
    }

    return players;
  }

}
