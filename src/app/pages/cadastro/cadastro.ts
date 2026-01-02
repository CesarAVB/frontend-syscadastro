// src/app/pages/cadastro/cadastro.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TipoPessoa } from '../../enums/tipo-pessoa.enum';
import { HeaderComponent } from '../../layout/header/header';

// Importações para máscaras (ngx-mask)
// Certifique-se de ter instalado: npm install ngx-mask
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    NgxMaskDirective,
    HeaderComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss'
})
export class CadastroComponent implements OnInit {
  formDadosPessoais!: FormGroup;
  formEnderecos!: FormGroup;
  formContatos!: FormGroup;
  tipoPessoa = signal<TipoPessoa>(TipoPessoa.FISICA);

  // EXPOR O ENUM PARA O TEMPLATE HTML
  public TipoPessoa = TipoPessoa;

  constructor(private fb: FormBuilder) {
    // O 'effect' foi removido para manter a classe o mais próximo possível do seu original,
    // focando apenas nas correções solicitadas.
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.formDadosPessoais = this.fb.group({
      nome: ['', Validators.required],
      cpfCnpj: ['', Validators.required], // Mantido como no seu original
      rg: [''], // Mantido como no seu original
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
    });

    this.formEnderecos = this.fb.group({
      cep: ['', Validators.required], // Mantido como no seu original
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
    });

    this.formContatos = this.fb.group({
      tipoEmail: ['EMAIL'],
      email: ['', [Validators.required, Validators.email]],
      tipoTelefone: ['TELEFONE'],
      telefone: ['', Validators.required], // Mantido como no seu original
    });
  }

  selecionarTipoPessoa(tipo: TipoPessoa): void {
    this.tipoPessoa.set(tipo);
  }

  buscarCep(): void {
    const cep = this.formEnderecos.get('cep')?.value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            this.formEnderecos.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            });
          } else {
            alert('CEP não encontrado!');
          }
        })
        .catch(error => {
          console.error('Erro ao buscar CEP:', error);
          alert('Erro ao buscar CEP. Tente novamente.');
        });
    }
  }

  submitCadastro(): void {
    if (this.formDadosPessoais.valid && this.formEnderecos.valid && this.formContatos.valid) {
      const dadosCompletos = {
        ...this.formDadosPessoais.value,
        tipoPessoa: this.tipoPessoa(), // <-- Corrigido para acessar o valor do signal
        enderecos: [this.formEnderecos.value],
        contatos: [
          { tipo: 'EMAIL', valor: this.formContatos.value.email },
          { tipo: 'TELEFONE', valor: this.formContatos.value.telefone }
        ]
      };
      console.log('Dados do cadastro:', dadosCompletos);
      alert('Cadastro realizado com sucesso! Verifique o console para os dados.');
      // Aqui você chamaria o serviço para enviar os dados para o backend
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
      this.marcarCamposComoTocados();
    }
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formDadosPessoais.controls).forEach(key => {
      this.formDadosPessoais.get(key)?.markAsTouched();
    });
    Object.keys(this.formEnderecos.controls).forEach(key => {
      this.formEnderecos.get(key)?.markAsTouched();
    });
    Object.keys(this.formContatos.controls).forEach(key => {
      this.formContatos.get(key)?.markAsTouched();
    });
  }
}
