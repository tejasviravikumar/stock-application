"""create posts table

Revision ID: 6a786310d6d8
Revises: 4c2debb70b80
Create Date: 2026-02-08 13:18:29.557096

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6a786310d6d8'
down_revision: Union[str, Sequence[str], None] = '4c2debb70b80'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('portfolios',
    sa.Column('portfolio_id',sa.Integer(),nullable=False,primary_key=True),
    sa.Column('user_id',sa.Integer(),nullable=False),
    sa.Column('name',sa.String(),nullable=False),
    sa.Column('created_at',sa.TIMESTAMP(timezone=True),server_default=sa.text('NOW()'),nullable=False),
    sa.ForeignKeyConstraint(['user_id'],['users.id'],ondelete='CASCADE'))
    
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('portfolios')
    pass
