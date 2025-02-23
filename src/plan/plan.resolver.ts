import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';
import { CreatePlan, UpdatePlan } from './dto';
import { Plan } from './plan.entity';
import { PlanService } from './plan.service';

@Resolver()
export class PlanResolver {
  constructor(private readonly _plan: PlanService) {}

  @Query(() => [Plan], { name: 'plans' })
  findAll() {
    return this._plan.findAll();
  }

  @Query(() => [Plan], { name: 'plansByGym' }) // 🔹 Nueva consulta por gymId
  findByGym(@Args('gymId', { type: () => Int }) gymId: number) {
    return this._plan.findByGymId(gymId);
  }

  @Query(() => Plan, { name: 'plan' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    console.log("entra a el resolver");
    const foundPlan = await this._plan.findOne(id);
    console.log(foundPlan);
    return foundPlan;
  }

  @Mutation(() => Plan, { name: "createPlan" })
  async createInput(@Args('createPlan') createPlan: CreatePlan) {
    return await this._plan.create(createPlan);
  }

  @Mutation(() => Plan, { name: "updatePlanByDS" })
  updateInput(@Args('updatePlan') updatePlan: UpdatePlan) {
    return this._plan.update(updatePlan);
  }

  @Mutation(() => Plan, { name: "getSatusPlan" })
  getSatus(@Args('id', { type: () => Int }) id: number) {
    return this._plan.getStatus(id);
  }

  @Mutation(() => Boolean, { name: "deletePlan" })
  delete(@Args('id', { type: () => Int }) id: number) {
    return this._plan.deletePlan(id);
  }
}
