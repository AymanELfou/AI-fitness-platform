import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Subscription {
  id: number; entity: string; type: 'club'|'coach'|'client'; plan: 'Basic'|'Pro'|'Enterprise';
  status: 'active'|'expired'|'cancelled'|'trial'; amount: string; cycle: 'Monthly'|'Annual';
  nextBilling: string; initial: string; color: string;
}

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class AdminSubscriptionsComponent {
  filterPlan = 'All'; filterStatus = 'All';
  plans    = ['All','Basic','Pro','Enterprise'];
  statuses = ['All','active','expired','cancelled','trial'];

  subscriptions: Subscription[] = [
    { id:1,  entity:'FitZone Casablanca',   type:'club',   plan:'Enterprise', status:'active',    amount:'$299', cycle:'Monthly', nextBilling:'Jul 1, 2026',  initial:'F', color:'#2563EB' },
    { id:2,  entity:'PowerHouse Rabat',      type:'club',   plan:'Pro',        status:'active',    amount:'$149', cycle:'Monthly', nextBilling:'Jul 3, 2026',  initial:'P', color:'#7C3AED' },
    { id:3,  entity:'Coach Marcus Chen',     type:'coach',  plan:'Pro',        status:'active',    amount:'$49',  cycle:'Monthly', nextBilling:'Jul 12, 2026', initial:'M', color:'#059669' },
    { id:4,  entity:'Coach Elena V.',        type:'coach',  plan:'Basic',      status:'active',    amount:'$19',  cycle:'Monthly', nextBilling:'Jul 5, 2026',  initial:'E', color:'#F59E0B' },
    { id:5,  entity:'Titan Gym Paris',       type:'club',   plan:'Enterprise', status:'active',    amount:'$299', cycle:'Annual',  nextBilling:'Jan 1, 2027',  initial:'T', color:'#DC2626' },
    { id:6,  entity:'Alex Johnson',          type:'client', plan:'Basic',      status:'active',    amount:'$9',   cycle:'Monthly', nextBilling:'Jul 14, 2026', initial:'A', color:'#2563EB' },
    { id:7,  entity:'GymPro Agadir',         type:'club',   plan:'Pro',        status:'expired',   amount:'$149', cycle:'Monthly', nextBilling:'Jun 1, 2026',  initial:'G', color:'#475569' },
    { id:8,  entity:'Coach Sam Tanner',      type:'coach',  plan:'Basic',      status:'cancelled', amount:'$19',  cycle:'Monthly', nextBilling:'—',            initial:'S', color:'#475569' },
    { id:9,  entity:'FlexLife Fès',          type:'club',   plan:'Basic',      status:'trial',     amount:'$0',   cycle:'Monthly', nextBilling:'Jun 30, 2026', initial:'FL',color:'#0891B2' },
    { id:10, entity:'Alpha Club Dubai',      type:'club',   plan:'Enterprise', status:'active',    amount:'$299', cycle:'Annual',  nextBilling:'Aug 15, 2026', initial:'A', color:'#7C3AED' },
  ];

  get filtered(): Subscription[] {
    return this.subscriptions.filter(s =>
      (this.filterPlan   === 'All' || s.plan   === this.filterPlan) &&
      (this.filterStatus === 'All' || s.status === this.filterStatus)
    );
  }

  get mrr(): string {
    const total = this.subscriptions
      .filter(s => s.status === 'active' && s.cycle === 'Monthly')
      .reduce((sum, s) => sum + parseFloat(s.amount.replace('$','')), 0);
    return '$' + total.toLocaleString();
  }

  get arr(): string {
    const monthly = this.subscriptions.filter(s => s.status === 'active' && s.cycle === 'Monthly').reduce((sum, s) => sum + parseFloat(s.amount.replace('$','')), 0);
    const annual  = this.subscriptions.filter(s => s.status === 'active' && s.cycle === 'Annual').reduce((sum, s) => sum + parseFloat(s.amount.replace('$','')), 0);
    return '$' + (monthly * 12 + annual).toLocaleString();
  }

  get activeCount():    number { return this.subscriptions.filter(s => s.status === 'active').length; }
  get expiringCount():  number { return this.subscriptions.filter(s => s.status === 'expired').length; }
}
