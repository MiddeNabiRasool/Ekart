import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/shared/models/customer';
import { Card } from 'src/app/shared/models/card';
import { CustomerCardsService } from './customer-cards.service';
// import { CustomerSharedService } from '../../customer-shared-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fbind } from 'q';
import { CustomerSharedService } from '../../customer-shared-service';

@Component({
  selector: 'customer-cards',
  templateUrl: './customer-cards.component.html',
  styleUrls: ['./customer-cards.component.css']
})
export class CustomerCardsComponent implements OnInit {

  loggedInCustomer: Customer;
  cards: Card[];
  successMessage: string = null;
  errorMessage: string = null;

  cardToUpdate: Card = null;
  copyOfCard:  Card;
  cardToAdd:  Card = null;
  cardToDelete: Card=null;

  cardForm:FormGroup;
  cardTypes:string[]=["CREDIT_CARD","DEBIT_CARD"];

  constructor(private cardService:CustomerCardsService,private fb:FormBuilder,
                  private customerSharedService:CustomerSharedService) { }

  ngOnInit(): void {
    this.successMessage = null;
        this.errorMessage = null;
        this.loggedInCustomer = JSON.parse(sessionStorage.getItem("customer"));
        this.getMyCard()
        
  }

  getMyCard(){ 
    this.errorMessage = null;
    this.cardService.getMyCards( this.loggedInCustomer.emailId).subscribe(
      response=>{
        this.cards = response; 
      },
      error=>{
        this.errorMessage = error.error.errorMessage;
        
        
      }
    )
  }

  addNewCard(){
    this.errorMessage = null;
    this.successMessage= null;
    this.cardToAdd = new Card();
    this.cardForm = this.fb.group({
      cardType:['',Validators.required],
      cardNumber:['',[Validators.required,Validators.maxLength(16),Validators.minLength(16),Validators.pattern("[0-9]+")]],
      cvv:['',[Validators.required,Validators.maxLength(3),Validators.minLength(3)]],
      expiryDate:['',Validators.required],
      nameOnCard:['',[Validators.required,Validators.pattern("(^[A-Z][a-z]+)( [A-Z][a-z]+)*$"),Validators.maxLength(50)]]

    })    

  }

  deleteCard(cardToDelete:Card){
    
    this.errorMessage = null;
    this.successMessage = null;
    this.cardService.deleteCard(cardToDelete.cardId).subscribe(
      res=>{
        this.successMessage = res;
        console.log(this.successMessage);
        this.cards = this.cards.filter(card=> card.cardId !== cardToDelete.cardId);
        this.customerSharedService.updateCardList(this.cards);
        this.loggedInCustomer.cards=this.cards;
        sessionStorage.setItem("customer",JSON.stringify(this.loggedInCustomer))   
      },
      err => {this.errorMessage=err.error.errorMessage
      
      }
    );
  }

  applyNewCard(){ 
    this.errorMessage = null;
    this.successMessage = null;
    this.cardForm.value.expiryDate=this.cardForm.value.expiryDate +"-28";
    this.cardToAdd = this.cardForm.value;
    this.cardService.addNewCard( this.cardToAdd,this.loggedInCustomer.emailId)
    .subscribe(
      response=>{
        this.successMessage = response;
        console.log(this.successMessage);
        
        this.cards.push(this.cardToAdd);
        this.loggedInCustomer.cards =this.cards;
        this.cardToAdd = null;
        sessionStorage.setItem("customer",JSON.stringify(this.loggedInCustomer));
         
      },
      error=>{
        this.errorMessage = error.error.errorMessage;
        
      }
    )


  }




}
